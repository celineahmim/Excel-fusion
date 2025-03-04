from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import FileResponse
import pandas as pd
import shutil
import os

app = FastAPI()

UPLOAD_DIR = "uploads"
MERGED_FILE = "merged.xlsx"

# Assurez-vous que le dossier uploads existe
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/")
def home():
    return {"message": "API FastAPI fonctionne !"}

@app.post("/upload")
async def upload_files(files: list[UploadFile] = File(...), outputFileName: str = Form("fusion_result.xlsx")):
    """
    Endpoint pour uploader et fusionner plusieurs fichiers Excel.
    """
    file_paths = []
    
    # Sauvegarde temporaire des fichiers uploadés
    for file in files:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        file_paths.append(file_path)

    # Fusionner les fichiers Excel
    merged_df = pd.concat([pd.read_excel(fp) for fp in file_paths], ignore_index=True)
    merged_output_path = os.path.join(UPLOAD_DIR, outputFileName)
    merged_df.to_excel(merged_output_path, index=False)

    return {"download_url": f"/download/{outputFileName}"}

@app.get("/download/{file_name}")
async def download_file(file_name: str):
    """
    Endpoint pour télécharger le fichier fusionné.
    """
    file_path = os.path.join(UPLOAD_DIR, file_name)
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", filename=file_name)
    return {"error": "Fichier non trouvé"}

