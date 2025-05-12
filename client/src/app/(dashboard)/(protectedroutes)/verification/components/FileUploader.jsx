"use client";

import { useState, useRef } from "react";
import { Upload, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const FileUploader = ({
  label,
  file,
  onChange,
  onRemove,
  inputId,
  placeholderText = "Drag and drop your file or",
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onChange({ target: { files: e.dataTransfer.files } });
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>

      {!file ? (
        <div
          className={`border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-gray-200 hover:border-primary/50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            id={inputId}
            type="file"
            className="hidden"
            onChange={onChange}
            accept="image/*"
            ref={fileInputRef}
          />
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <p className="text-sm text-center mb-1">
            {placeholderText}{" "}
            <span className="text-primary font-medium">browse</span>
          </p>
          <p className="text-xs text-muted-foreground text-center">
            Supported formats: JPG, PNG, PDF. Max size: 5MB
          </p>
        </div>
      ) : (
        <div className="border rounded-md p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium truncate max-w-[200px]">
                {file.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Remove file</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
