import { ProjectList } from "@/components/projects/project-list";
import { ProjectFormDialog } from "@/components/projects/project-form-dialog";
import { fetchProjects } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FolderKanban } from "lucide-react";

export const revalidate = 10;

export default async function ProjectsPage() {
  const projects = await fetchProjects();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">项目管理</h1>
          <p className="text-muted-foreground">管理所有客户项目</p>
        </div>
        <ProjectFormDialog
          mode="create"
          trigger={
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              新建项目
            </Button>
          }
        />
      </div>

      {projects.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">项目列表</CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectList projects={projects} />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <FolderKanban className="h-7 w-7 text-muted-foreground" />
              </div>
              <h3 className="font-semibold">还没有项目</h3>
              <p className="mt-1 text-sm text-muted-foreground max-w-sm">
                创建你的第一个项目，开始管理客户交付和进度追踪
              </p>
              <ProjectFormDialog
                mode="create"
                trigger={
                  <Button className="mt-6 gap-2">
                    <Plus className="h-4 w-4" />
                    创建第一个项目
                  </Button>
                }
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
