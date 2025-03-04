from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse
import pandas as pd
import shutil
import os

app = FastAPI()

UPLOAD_DIR = "uploads"
OUTPUT_DIR = "output"

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

@app.post("/upload")
async def upload_files(files: list[UploadFile], outputFileName: str = "fusion_result.xlsx"):
    file_paths = []
    for file in files:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        file_paths.append(file_path)
    
    # Fusionner les fichiers Excel
    dfs = [pd.read_excel(f) for f in file_paths]
    merged_df = pd.concat(dfs, ignore_index=True)
    output_path = os.path.join(OUTPUT_DIR, outputFileName)
    merged_df.to_excel(output_path, index=False)

    return {"download_url": f"/download/{outputFileName}"}

@app.get("/download/{filename}")
async def download_file(filename: str):
    return FileResponse(path=os.path.join(OUTPUT_DIR, filename), filename=filename)
