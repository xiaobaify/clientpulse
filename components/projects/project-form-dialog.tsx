"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createProject, updateProject } from "@/lib/api";
import { Plus, Loader2 } from "lucide-react";

interface ProjectFormDialogProps {
  mode: "create" | "edit";
  trigger?: React.ReactNode;
  defaultValues?: {
    id?: string;
    name?: string;
    clientName?: string;
    clientEmail?: string;
    status?: string;
  };
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ProjectFormDialog({
  mode,
  trigger,
  defaultValues,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: ProjectFormDialogProps) {
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const onOpenChange = controlledOnOpenChange ?? setInternalOpen;

  const [name, setName] = useState(defaultValues?.name ?? "");
  const [clientName, setClientName] = useState(defaultValues?.clientName ?? "");
  const [clientEmail, setClientEmail] = useState(defaultValues?.clientEmail ?? "");
  const [status, setStatus] = useState(defaultValues?.status ?? "draft");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("请输入项目名称");
      return;
    }
    if (!clientName.trim()) {
      setError("请输入客户名称");
      return;
    }

    setLoading(true);
    try {
      if (mode === "create") {
        await createProject({
          name: name.trim(),
          clientName: clientName.trim(),
          clientEmail: clientEmail.trim() || undefined,
        });
      } else {
        await updateProject(defaultValues!.id!, {
          name: name.trim(),
          clientName: clientName.trim(),
          clientEmail: clientEmail.trim() || undefined,
          status,
        });
      }
      onOpenChange(false);
      router.refresh();
      // Reset form on create
      if (mode === "create") {
        setName("");
        setClientName("");
        setClientEmail("");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "操作失败，请重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && (
        <DialogTrigger
          nativeButton={false}
          render={<span className="inline-flex" />}
        >
          {trigger}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "新建项目" : "编辑项目"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-name">项目名称</Label>
            <Input
              id="project-name"
              placeholder="例如：官网 redesign"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="client-name">客户名称</Label>
            <Input
              id="client-name"
              placeholder="例如：张三"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="client-email">客户邮箱（可选）</Label>
            <Input
              id="client-email"
              type="email"
              placeholder="client@example.com"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
            />
          </div>
          {mode === "edit" && (
            <div className="space-y-2">
              <Label>项目状态</Label>
              <Select value={status} onValueChange={(v) => setStatus(v ?? "draft")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">草稿</SelectItem>
                  <SelectItem value="active">进行中</SelectItem>
                  <SelectItem value="completed">已完成</SelectItem>
                  <SelectItem value="archived">已归档</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {error && (
            <div className="rounded-lg bg-destructive/10 px-3 py-2">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              取消
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "create" ? "创建" : "保存"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
