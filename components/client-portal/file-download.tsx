import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeliverableFile } from "@/lib/types";
import { FileText, Download, Image, Film, Archive } from "lucide-react";
import { formatFileSize } from "@/lib/utils";

interface FileDownloadProps {
  files: DeliverableFile[];
}

function getFileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext ?? ""))
    return Image;
  if (["mp4", "mov", "avi"].includes(ext ?? "")) return Film;
  if (["zip", "rar", "7z", "tar"].includes(ext ?? "")) return Archive;
  return FileText;
}

export function FileDownload({ files }: FileDownloadProps) {
  if (files.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">可下载文件</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {files.map((file) => {
            const FileIcon = getFileIcon(file.name);
            return (
              <div
                key={file.id}
                className="group flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <FileIcon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium opacity-0 group-hover:opacity-100 hover:bg-muted transition-all"
                >
                  <Download className="h-3.5 w-3.5" />
                  下载
                </a>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
