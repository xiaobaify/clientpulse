"use client";

import { ProgressBar } from "@/components/client-portal/progress-bar";
import { StageTimeline } from "@/components/client-portal/stage-timeline";
import { FileDownload } from "@/components/client-portal/file-download";
import { PasswordGate } from "@/components/client-portal/password-gate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Zap, Loader2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { notFound } from "next/navigation";
import { fetchProjectByShareId, fetchMessagesByProject, createMessage } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import type { Project, ClientMessage } from "@/lib/types";

interface ClientPortalPageProps {
  params: Promise<{ shareId: string }>;
}

export default function ClientPortalPage({ params }: ClientPortalPageProps) {
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [message, setMessage] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [project, setProject] = useState<Project | null>(null);
  const [messages, setMessages] = useState<ClientMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [notFoundFlag, setNotFound] = useState(false);

  const loadMessages = useCallback(async (projectId: string) => {
    const msgs = await fetchMessagesByProject(projectId);
    setMessages(msgs);
  }, []);

  useEffect(() => {
    params.then(async (p) => {
      const proj = await fetchProjectByShareId(p.shareId);
      if (!proj) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setProject(proj);
      await loadMessages(proj.id);
      setLoading(false);
    });
  }, [params, loadMessages]);

  if (notFoundFlag) {
    notFound();
  }

  if (loading || !project) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">加载项目信息...</p>
        </div>
      </div>
    );
  }

  const needsPassword = !!project.sharePassword;

  function handlePasswordSubmit(password: string) {
    if (password === project?.sharePassword) {
      setAuthenticated(true);
      setPasswordError("");
    } else {
      setPasswordError("密码错误，请重试");
    }
  }

  function getProgress() {
    if (!project || project.stages.length === 0) return 0;
    const completed = project.stages.filter(
      (s) => s.status === "completed"
    ).length;
    return Math.round((completed / project.stages.length) * 100);
  }

  function getAllFiles() {
    if (!project) return [];
    return project.stages.flatMap((stage) => stage.files);
  }

  async function handleSendMessage() {
    if (!message.trim()) return;
    setSending(true);
    try {
      await createMessage(
        project!.id,
        message.trim(),
        authorName.trim() || "客户"
      );
      setMessage("");
      await loadMessages(project!.id);
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSending(false);
    }
  }

  if (needsPassword && !authenticated) {
    return (
      <PasswordGate onSubmit={handlePasswordSubmit} error={passwordError} />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Brand header */}
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container max-w-2xl mx-auto flex items-center gap-2.5 px-4 py-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary shadow-sm shadow-primary/25">
            <Zap className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold tracking-tight">
            ClientPulse
          </span>
        </div>
      </header>

      <div className="container max-w-2xl mx-auto py-8 px-4 space-y-6">
        {/* Project header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
          <p className="text-muted-foreground">
            为 {project.clientName} 定制的项目进度
          </p>
        </div>

        {/* Progress overview */}
        <Card className="overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-primary via-chart-3 to-chart-1" />
          <CardContent className="pt-6">
            <ProgressBar value={getProgress()} />
          </CardContent>
        </Card>

        {/* Stage timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">阶段详情</CardTitle>
          </CardHeader>
          <CardContent>
            <StageTimeline stages={project.stages} />
          </CardContent>
        </Card>

        {/* Files */}
        <FileDownload files={getAllFiles()} />

        {/* Messages */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">留言给项目团队</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Input
                placeholder="您的称呼（可选）"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="h-9 text-sm"
              />
              <div className="flex gap-2">
                <Input
                  placeholder="输入你的留言..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="h-9 text-sm"
                />
                <Button
                  size="sm"
                  onClick={handleSendMessage}
                  disabled={!message.trim() || sending}
                  className="px-3"
                >
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {messages.length > 0 && (
              <div className="mt-4 space-y-2">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="rounded-lg bg-muted/50 border p-3"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">
                        {msg.authorName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(msg.createdAt), {
                          addSuffix: true,
                          locale: zhCN,
                        })}
                      </span>
                    </div>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container max-w-2xl mx-auto px-4 py-4 text-center">
          <p className="text-xs text-muted-foreground">
            Powered by{" "}
            <span className="font-medium text-foreground/80">ClientPulse</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
