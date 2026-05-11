import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientMessage } from "@/lib/types";
import { MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";

interface ClientMessagesProps {
  messages: ClientMessage[];
}

export function ClientMessages({ messages }: ClientMessagesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          客户留言
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="rounded-lg border p-4">
              <div className="flex items-center justify-between mb-2">
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
        </div>
      </CardContent>
    </Card>
  );
}
