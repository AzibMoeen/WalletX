import { useRef, useState } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const FileUploader = ({
  label,
  file,
  onChange,
  onRemove,
  inputId,
  placeholderText = "Drag and drop files or"
}) => {
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onChange(e)
    }
  }

  const handleClick = () => {
    inputRef.current.click()
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={inputId} className="text-base">
        {label}
      </Label>
      {!file ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 ${
            dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <Upload className="h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              {placeholderText}{" "}
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto font-normal text-sm underline"
                onClick={handleClick}
              >
                browse
              </Button>
            </p>
            <p className="text-xs text-muted-foreground">
              Supported formats: JPG, PNG, PDF
            </p>
            <Input
              ref={inputRef}
              id={inputId}
              type="file"
              accept="image/jpeg,image/png,application/pdf"
              className="hidden"
              onChange={onChange}
            />
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center text-primary">
                {file.type.startsWith("image/") ? (
                  <div className="w-full h-full overflow-hidden rounded-md">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <Upload className="h-5 w-5" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default FileUploader