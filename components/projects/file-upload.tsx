"use client";

import { Button } from "@/components/ui/button";
import { DeliverableFile } from "@/lib/types";
import { Upload, File, Trash2, Download } from "lucide-react";
import { formatFileSize } from "@/lib/utils";

interface FileUploadProps {
  files: DeliverableFile[];
  onUpload?: (file: File) => void;
  onDelete?: (fileId: string) => void;
}

export function FileUpload({ files, onUpload, onDelete }: FileUploadProps) {
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && onUpload) {
      onUpload(file);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">交付文件</h4>
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="inline-flex items-center justify-center rounded-md border px-3 py-1.5 text-sm hover:bg-muted">
            <Upload className="mr-2 h-4 w-4" />
            上传文件
          </div>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>

      <div className="space-y-2">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <div className="flex items-center gap-3">
              <File className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon">
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete?.(file.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {files.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            暂无文件
          </p>
        )}
      </div>
    </div>
  );
}
