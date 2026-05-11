"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link2, Copy, Check } from "lucide-react";
import { useState } from "react";

interface ShareLinkGeneratorProps {
  shareId: string;
  hasPassword?: boolean;
}

export function ShareLinkGenerator({
  shareId,
  hasPassword,
}: ShareLinkGeneratorProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/p/${shareId}`
      : `/p/${shareId}`;

  function handleCopy() {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium flex items-center gap-2">
        <Link2 className="h-4 w-4" />
        客户分享链接
      </h4>

      <div className="flex items-center gap-2">
        <Input value={shareUrl} readOnly className="flex-1" />
        <Button variant="outline" size="icon" onClick={handleCopy}>
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>

      {hasPassword && (
        <p className="text-xs text-muted-foreground">
          此链接已设置密码保护
        </p>
      )}
    </div>
  );
}
