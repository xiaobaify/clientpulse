"use client";

import { Button } from "@/components/ui/button";
import { DeliverableFile } from "@/lib/types";
import { Upload, File, Trash2, Download } from "lucide-react";
import { formatFileSize } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

interface FileUploadProps {
  files: DeliverableFile[];
  stageId: string;
  onUploaded?: () => void;
}

export function FileUpload({ files, stageId, onUploaded }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const path = `${stageId}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("deliverables")
        .upload(path, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("deliverables").getPublicUrl(path);

      // Insert deliverable record in DB
      const { error: dbError } = await supabase.from("deliverables").insert({
        stage_id: stageId,
        name: file.name,
        url: publicUrl,
        size: file.size,
      });

      if (dbError) throw dbError;

      onUploaded?.();
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(fileId: string) {
    const { error } = await supabase
      .from("deliverables")
      .delete()
      .eq("id", fileId);

    if (!error) {
      onUploaded?.();
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">交付文件</h4>
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="inline-flex items-center justify-center rounded-md border px-3 py-1.5 text-sm hover:bg-muted">
            <Upload className="mr-2 h-4 w-4" />
            {uploading ? "上传中..." : "上传文件"}
          </div>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
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
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md p-2 hover:bg-muted"
              >
                <Download className="h-4 w-4" />
              </a>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(file.id)}
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
