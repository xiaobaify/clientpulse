import { notFound } from "next/navigation";
import { fetchProjectById, fetchMessagesByProject } from "@/lib/api";
import { StageBoard } from "@/components/projects/stage-board";
import { FileUpload } from "@/components/projects/file-upload";
import { ShareLinkGenerator } from "@/components/projects/share-link-generator";
import { ClientMessages } from "@/components/projects/client-messages";
import { ProjectFormDialog } from "@/components/projects/project-form-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const revalidate = 10;

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

const statusConfig = {
  draft: {
    className: "bg-muted text-muted-foreground",
    label: "草稿",
  },
  active: {
    className: "bg-primary/10 text-primary",
    label: "进行中",
  },
  completed: {
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    label: "已完成",
  },
  archived: {
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    label: "已归档",
  },
};

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;
  const project = await fetchProjectById(id);

  if (!project) {
    notFound();
  }

  const projectMessages = await fetchMessagesByProject(project.id);

  const currentStage = project.stages.find(
    (s) => s.status === "in_progress"
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/projects"
            className="inline-flex items-center justify-center rounded-lg p-2 hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight">
                {project.name}
              </h1>
              <Badge
                variant="secondary"
                className={cn("text-xs", statusConfig[project.status]?.className)}
              >
                {statusConfig[project.status]?.label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {project.clientName}
            </p>
          </div>
        </div>
        <ProjectFormDialog
          mode="edit"
          defaultValues={{
            id: project.id,
            name: project.name,
            clientName: project.clientName,
            clientEmail: project.clientEmail,
            status: project.status,
          }}
          trigger={
            <button className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">
              <Edit className="h-4 w-4" />
              编辑
            </button>
          }
        />
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">阶段管理</CardTitle>
          </CardHeader>
          <CardContent>
            <StageBoard stages={project.stages} projectId={project.id} />
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">当前阶段</CardTitle>
            </CardHeader>
            <CardContent>
              {currentStage ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse-glow" />
                    <p className="font-medium text-sm">{currentStage.name}</p>
                  </div>
                  <FileUpload files={currentStage.files} stageId={currentStage.id} />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    暂无进行中的阶段
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <ShareLinkGenerator
              shareId={project.shareId}
              hasPassword={!!project.sharePassword}
            />
            <ClientMessages messages={projectMessages} projectId={project.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
