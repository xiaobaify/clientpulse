export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "admin" | "editor" | "viewer";
  status: "active" | "inactive" | "suspended";
  plan: "free" | "pro" | "enterprise";
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  clientName: string;
  clientEmail?: string;
  shareId: string;
  sharePassword?: string;
  stages: Stage[];
  status: "draft" | "active" | "completed" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface Stage {
  id: string;
  name: string;
  order: number;
  status: "pending" | "in_progress" | "completed";
  expectedDate?: string;
  completedDate?: string;
  files: DeliverableFile[];
}

export interface DeliverableFile {
  id: string;
  name: string;
  url: string;
  size: number;
  uploadedAt: string;
}

export interface ClientMessage {
  id: string;
  projectId: string;
  content: string;
  authorName: string;
  createdAt: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  interval: "monthly" | "yearly";
  features: string[];
  maxProjects: number;
  maxStorage: number;
}

export interface Activity {
  id: string;
  type: "user_signup" | "project_update" | "subscription" | "file_upload";
  description: string;
  timestamp: string;
}
