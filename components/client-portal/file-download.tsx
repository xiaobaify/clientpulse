import { Button } from "@/components/ui/button";
import { DeliverableFile } from "@/lib/types";
import { File, Download } from "lucide-react";
import { formatFileSize } from "@/lib/utils";

interface FileDownloadProps {
  files: DeliverableFile[];
}

export function FileDownload({ files }: FileDownloadProps) {
  if (files.length === 0) return null;

  return (
    <div className="space-y-3">
      <h4 className="font-medium">可下载文件</h4>
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
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
            >
              <Download className="mr-2 h-4 w-4" />
              下载
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
