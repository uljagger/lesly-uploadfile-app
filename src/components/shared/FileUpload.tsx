import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

function FileUpload() {
  const onDrop = useCallback((acceptedFiles: any) => {
    // Do something with the files 
    console.log(acceptedFiles);
    
  }, []);
  
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop files here...</p> :  
          <p>Drag n drop some files here, or click to select files</p>
      }
    </div>
  );
}

export default FileUpload;
