import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function FusionPage() {
  const [keywords, setKeywords] = useState("");
  const [files, setFiles] = useState([]);
  const [outputFileName, setOutputFileName] = useState("fusion_result.xlsx");
  const [downloadUrl, setDownloadUrl] = useState(null);

  const handleKeywordChange = (event) => {
    setKeywords(event.target.value);
  };

  const handleFileChange = (event) => {
    setFiles(Array.from(event.target.files));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Veuillez sélectionner des fichiers.");
      return;
    }

    let formData = new FormData();
    files.forEach(file => formData.append("files", file));
    formData.append("outputFileName", outputFileName);

    let response = await fetch("http://localhost:8000/upload", {
      method: "POST",
      body: formData,
    });

    let data = await response.json();
    setDownloadUrl(data.download_url);
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <div className="w-64 bg-gray-800 p-6 flex flex-col items-start">
        <img src="/logo.png" alt="Logo" className="w-32" />
        <nav className="mt-6">
          <a href="#" className="block py-2 px-4 text-gray-300 hover:text-white">
            Fusionner
          </a>
        </nav>
      </div>

      <div className="flex-1 p-10">
        <h2 className="text-2xl font-semibold">Fusionner des fichiers Excel</h2>
        <p className="text-gray-400 mt-2">Insérez vos mots-clés (un par ligne, laissez une ligne vide entre chaque groupe)</p>

        <textarea
          placeholder="1. Plombier

2. Entrepreneur

3. Électricien"
          value={keywords}
          onChange={handleKeywordChange}
          className="mt-4 p-2 bg-gray-700 border border-gray-600 rounded w-full h-32"
        />

        <div className="mt-6">
          <label className="block text-gray-400">Téléchargez vos fichiers Excel :</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="mt-2 bg-gray-700 border border-gray-600 p-2 rounded w-full"
          />
        </div>

        <div className="mt-6">
          <label className="block text-gray-400">Nom du fichier fusionné :</label>
          <Input
            type="text"
            value={outputFileName}
            onChange={(e) => setOutputFileName(e.target.value)}
            className="mt-2 p-2 bg-gray-700 border border-gray-600 rounded w-full"
          />
        </div>

        <Button onClick={handleUpload} className="mt-6 bg-orange-500 hover:bg-orange-600 py-2 px-6 rounded">
          Lancer la fusion
        </Button>

        {downloadUrl && (
          <a href={downloadUrl} className="mt-6 inline-block text-blue-400 hover:text-blue-500 underline">
            Télécharger le fichier fusionné
          </a>
        )}
      </div>
    </div>
  );
}