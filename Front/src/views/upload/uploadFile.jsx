import React, { useState } from "react";

const FileUploadList = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const user = "Current User"; // Replace this with dynamic user data if needed
    const newFiles = files.map((file) => ({
      filename: file.name,
      size: (file.size / 1024).toFixed(2) + " KB", // Size in KB
      uploadDateTime: new Date().toLocaleString(),
      //   user: user, // Add user information
      user: "test", // Add user information
    }));

    setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">File Upload</h1>
      <div className="mb-4">
        <label className="block mb-2 font-medium">Upload XLS or CSV:</label>
        <input
          type="file"
          accept=".xls,.xlsx,.csv"
          multiple
          onChange={handleFileUpload}
          className="file:mr-4 file:py-2 file:px-4 file:border file:rounded-md file:bg-blue-500 file:text-white file:cursor-pointer file:shadow-md"
        />
      </div>

      {uploadedFiles.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Uploaded Files</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Filename</th>
                <th className="border border-gray-300 px-4 py-2">Size</th>
                <th className="border border-gray-300 px-4 py-2">
                  Upload Date & Time
                </th>
                <th className="border border-gray-300 px-4 py-2">User</th>
              </tr>
            </thead>
            <tbody>
              {uploadedFiles.map((file, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    {file.filename}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {file.size}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {file.uploadDateTime}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {file.user}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FileUploadList;
