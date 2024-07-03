import React, { useState, ChangeEvent, DragEvent } from 'react';
import axios from 'axios';
import './DragDrop.css';

const DragDrop: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      previewFile(selectedFile);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      previewFile(droppedFile);
    }
  };

  const previewFile = (file: File) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onloadend = () => {
      setPreview(fileReader.result as string);
    };
  };

  const handleFileUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post('https://httpbin.org/post', formData);
        console.log(response.data);
        alert('File uploaded successfully!');
      } catch (error) {
        console.error('Error uploading file: ', error);
        alert('Failed to upload file.');
      }
    }
  };

  return (
    <div className="drag-area" onDragOver={handleDragOver} onDrop={handleDrop}>
      {preview ? (
        <img src={preview} alt="Preview" />
      ) : (
        <>
          <div className="icon"><i className="fas fa-cloud-upload-alt"></i></div>
          <header>Drag & Drop to Upload File</header>
          <span>OR</span>
          <button onClick={() => document.getElementById('fileInput')?.click()}>Browse File</button>
          <input
            type="file"
            id="fileInput"
            hidden
            onChange={handleFileChange}
          />
        </>
      )}
      {file && <button onClick={handleFileUpload}>Upload File</button>}
    </div>
  );
};

export default DragDrop;
