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

// Supabase row types (matching DB columns)
export interface ProfileRow {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: string;
  status: string;
  plan: string;
  created_at: string;
}

export interface ProjectRow {
  id: string;
  name: string;
  client_name: string;
  client_email: string | null;
  share_id: string;
  share_password: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface StageRow {
  id: string;
  project_id: string;
  name: string;
  sort_order: number;
  status: string;
  expected_date: string | null;
  completed_date: string | null;
}

export interface DeliverableRow {
  id: string;
  stage_id: string;
  name: string;
  url: string;
  size: number;
  uploaded_at: string;
}

export interface ClientMessageRow {
  id: string;
  project_id: string;
  content: string;
  author_name: string;
  created_at: string;
}

export interface PlanRow {
  id: string;
  name: string;
  price: number;
  interval: string;
  features: string[];
  max_projects: number;
  max_storage: number;
}
