import React, { useState, useEffect } from "react";
import { FileText, X, Upload, File } from "lucide-react";

type DocumentData = {
  file_name: string;
  file_path: string;
  predicted_label: string;
  confidence: number;
  upload_date: string;
};

type UploadFormData = {
  documentType: string;
  documentName: string;
  file: File | null;
};

const Documents: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [documentsList, setDocumentsList] = useState<DocumentData[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<UploadFormData>({
    documentType: "",
    documentName: "",
    file: null,
  });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8081/docs/get_images", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch documents");

      const data = await response.json();
      setDocumentsList(data.images);
    } catch (error) {
      console.error("Error fetching documents:", error);
      alert("Failed to fetch documents. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");

      const formDataObj = new FormData();
      formDataObj.append("file", formData.file);

      const uploadResponse = await fetch("http://127.0.0.1:8081/docs/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataObj,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload document");
      }

      const result = await uploadResponse.json();

      // Show the prediction result
      alert(
        `Document analyzed!\nResult: ${result.predicted_label}\nConfidence: ${(
          result.confidence * 100
        ).toFixed(2)}%`
      );

      // Refresh the documents list
      await fetchDocuments();

      setIsModalOpen(false);
      setFormData({ documentType: "", documentName: "", file: null });
    } catch (error) {
      console.error("Error uploading document:", error);
      alert("Failed to upload document. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (
      file.type === "image/png" ||
      file.type === "image/jpeg" ||
      file.type === "image/jpg"
    ) {
      setFormData((prev) => ({ ...prev, file }));
    } else {
      alert("Please upload only PNG, JPG, or JPEG files");
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Documents Vault</h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
          >
            Upload Document
          </button>
        </div>
        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documentsList.map((doc) => (
              <div
                key={doc.file_path}
                className="border rounded-lg p-4 hover:border-blue-500 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="text-gray-500" />
                  <div className="flex-1">
                    <p className="font-medium">{doc.file_name}</p>
                    <div className="flex flex-col space-y-1 text-sm">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs 
                        ${
                          doc.predicted_label === "Real"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {doc.predicted_label} (
                        {(doc.confidence * 100).toFixed(2)}% confidence)
                      </span>
                      <span className="text-gray-500">
                        Uploaded on{" "}
                        {new Date(doc.upload_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md m-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Upload Document</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors
                  ${
                    dragActive
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300"
                  }
                  ${formData.file ? "bg-green-50" : ""}`}
              >
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  {formData.file ? (
                    <>
                      <File className="w-8 h-8 text-green-500 mb-2" />
                      <p className="text-sm text-green-600 font-medium">
                        {formData.file.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatFileSize(formData.file.size)}
                      </p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">
                        Drag & drop your image here or{" "}
                        <span className="text-blue-500">browse</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Supports PNG, JPG, JPEG
                      </p>
                    </>
                  )}
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={!formData.file || isLoading}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 
                    disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? "Analyzing..." : "Upload & Analyze"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg 
                    hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
