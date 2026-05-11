"use client";

import { mockProjects, mockMessages } from "@/lib/mock-data";
import { ProgressBar } from "@/components/client-portal/progress-bar";
import { StageTimeline } from "@/components/client-portal/stage-timeline";
import { FileDownload } from "@/components/client-portal/file-download";
import { PasswordGate } from "@/components/client-portal/password-gate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useState } from "react";
import { notFound } from "next/navigation";

interface ClientPortalPageProps {
  params: { shareId: string };
}

export default function ClientPortalPage({ params }: ClientPortalPageProps) {
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [message, setMessage] = useState("");

  const project = mockProjects.find((p) => p.shareId === params.shareId);

  if (!project) {
    notFound();
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

  if (needsPassword && !authenticated) {
    return (
      <PasswordGate onSubmit={handlePasswordSubmit} error={passwordError} />
    );
  }

  const projectMessages = mockMessages.filter(
    (m) => m.projectId === project?.id
  );

  return (
    <div className="container max-w-2xl mx-auto py-12 px-4 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">{project.name}</h1>
        <p className="text-muted-foreground">项目进度</p>
      </div>

      <ProgressBar value={getProgress()} />

      <Card>
        <CardHeader>
          <CardTitle>阶段详情</CardTitle>
        </CardHeader>
        <CardContent>
          <StageTimeline stages={project.stages} />
        </CardContent>
      </Card>

      <FileDownload files={getAllFiles()} />

      <Card>
        <CardHeader>
          <CardTitle>留言给项目团队</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="输入你的留言..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button>
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {projectMessages.length > 0 && (
            <div className="mt-4 space-y-3">
              {projectMessages.map((msg) => (
                <div key={msg.id} className="rounded-lg bg-muted p-3">
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    — {msg.authorName}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
