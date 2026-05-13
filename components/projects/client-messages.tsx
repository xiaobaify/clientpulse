"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ClientMessage } from "@/lib/types";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import { useState } from "react";
import { createMessage } from "@/lib/api";
import { useRouter } from "next/navigation";

interface ClientMessagesProps {
  messages: ClientMessage[];
  projectId?: string;
}

export function ClientMessages({ messages, projectId }: ClientMessagesProps) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!content.trim() || !projectId) return;
    setLoading(true);
    try {
      await createMessage(projectId, content.trim(), "管理员");
      setContent("");
      router.refresh();
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <MessageSquare className="h-4 w-4" />
          客户留言
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {messages.map((message) => (
            <div key={message.id} className="rounded-lg border p-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-medium text-sm">{message.authorName}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(message.createdAt), {
                    addSuffix: true,
                    locale: zhCN,
                  })}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {message.content}
              </p>
            </div>
          ))}

          {messages.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              暂无留言
            </p>
          )}

          {projectId && (
            <div className="flex gap-2 pt-2 border-t">
              <Input
                placeholder="回复客户..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                className="h-9 text-sm"
              />
              <Button
                size="sm"
                onClick={handleSend}
                disabled={!content.trim() || loading}
                className="px-3"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
