import { supabase } from "./supabase";
import type {
  User,
  Project,
  Stage,
  DeliverableFile,
  ClientMessage,
  Plan,
  ProfileRow,
  ProjectRow,
  StageRow,
  DeliverableRow,
  ClientMessageRow,
  PlanRow,
} from "./types";

// --- Mappers ---

function mapProfile(row: ProfileRow): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    avatar: row.avatar ?? undefined,
    role: row.role as User["role"],
    status: row.status as User["status"],
    plan: row.plan as User["plan"],
    createdAt: row.created_at,
  };
}

function mapDeliverable(row: DeliverableRow): DeliverableFile {
  return {
    id: row.id,
    name: row.name,
    url: row.url,
    size: row.size,
    uploadedAt: row.uploaded_at,
  };
}

function mapStage(row: StageRow, deliverables: DeliverableRow[]): Stage {
  return {
    id: row.id,
    name: row.name,
    order: row.sort_order,
    status: row.status as Stage["status"],
    expectedDate: row.expected_date ?? undefined,
    completedDate: row.completed_date ?? undefined,
    files: deliverables
      .filter((d) => d.stage_id === row.id)
      .map(mapDeliverable),
  };
}

function mapProject(
  row: ProjectRow,
  stages: StageRow[],
  deliverables: DeliverableRow[]
): Project {
  return {
    id: row.id,
    name: row.name,
    clientName: row.client_name,
    clientEmail: row.client_email ?? undefined,
    shareId: row.share_id,
    sharePassword: row.share_password ?? undefined,
    status: row.status as Project["status"],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    stages: stages
      .filter((s) => s.project_id === row.id)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((s) => mapStage(s, deliverables)),
  };
}

function mapMessage(row: ClientMessageRow): ClientMessage {
  return {
    id: row.id,
    projectId: row.project_id,
    content: row.content,
    authorName: row.author_name,
    createdAt: row.created_at,
  };
}

function mapPlan(row: PlanRow): Plan {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    interval: row.interval as Plan["interval"],
    features: row.features,
    maxProjects: row.max_projects,
    maxStorage: row.max_storage,
  };
}

// --- API Functions ---

export async function fetchUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("fetchUsers error:", error.message);
    return [];
  }
  return (data as ProfileRow[]).map(mapProfile);
}

export async function fetchUserById(id: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return mapProfile(data as ProfileRow);
}

export async function fetchProjects(): Promise<Project[]> {
  const { data: projects, error: pErr } = await supabase
    .from("projects")
    .select("*")
    .order("updated_at", { ascending: false });

  if (pErr) {
    console.error("fetchProjects error:", pErr.message);
    return [];
  }
  if (!projects || projects.length === 0) return [];

  const projectIds = projects.map((p) => p.id);

  const { data: stages } = await supabase
    .from("stages")
    .select("*")
    .in("project_id", projectIds);

  const stageIds = (stages ?? []).map((s) => s.id);

  const { data: deliverables } =
    stageIds.length > 0
      ? await supabase.from("deliverables").select("*").in("stage_id", stageIds)
      : { data: [] };

  return (projects as ProjectRow[]).map((p) =>
    mapProject(p, (stages as StageRow[]) ?? [], (deliverables as DeliverableRow[]) ?? [])
  );
}

export async function fetchProjectById(id: string): Promise<Project | null> {
  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;

  const { data: stages } = await supabase
    .from("stages")
    .select("*")
    .eq("project_id", id);

  const stageIds = (stages ?? []).map((s) => s.id);

  const { data: deliverables } =
    stageIds.length > 0
      ? await supabase.from("deliverables").select("*").in("stage_id", stageIds)
      : { data: [] };

  return mapProject(
    project as ProjectRow,
    (stages as StageRow[]) ?? [],
    (deliverables as DeliverableRow[]) ?? []
  );
}

export async function fetchProjectByShareId(
  shareId: string
): Promise<Project | null> {
  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("share_id", shareId)
    .single();

  if (error) return null;

  const { data: stages } = await supabase
    .from("stages")
    .select("*")
    .eq("project_id", project.id);

  const stageIds = (stages ?? []).map((s) => s.id);

  const { data: deliverables } =
    stageIds.length > 0
      ? await supabase.from("deliverables").select("*").in("stage_id", stageIds)
      : { data: [] };

  return mapProject(
    project as ProjectRow,
    (stages as StageRow[]) ?? [],
    (deliverables as DeliverableRow[]) ?? []
  );
}

export async function fetchMessagesByProject(
  projectId: string
): Promise<ClientMessage[]> {
  const { data, error } = await supabase
    .from("client_messages")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("fetchMessages error:", error.message);
    return [];
  }
  return (data as ClientMessageRow[]).map(mapMessage);
}

export async function fetchPlans(): Promise<Plan[]> {
  const { data, error } = await supabase
    .from("plans")
    .select("*")
    .order("price", { ascending: true });

  if (error) {
    console.error("fetchPlans error:", error.message);
    return [];
  }
  return (data as PlanRow[]).map(mapPlan);
}

// --- Stats (derived from real data) ---

export async function fetchStats() {
  const [usersRes, projectsRes] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("projects").select("id", { count: "exact", head: true }),
  ]);

  const { count: activeCount } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("status", "active");

  return {
    totalUsers: usersRes.count ?? 0,
    activeUsers: activeCount ?? 0,
    monthlyRevenue: 0,
    totalProjects: projectsRes.count ?? 0,
  };
}

// --- Storage ---

export async function uploadFile(
  file: File,
  path: string
): Promise<{ url: string; size: number }> {
  const { error } = await supabase.storage
    .from("deliverables")
    .upload(path, file);

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from("deliverables").getPublicUrl(path);

  return { url: publicUrl, size: file.size };
}

export async function deleteFile(path: string): Promise<void> {
  const { error } = await supabase.storage
    .from("deliverables")
    .remove([path]);

  if (error) throw error;
}

// --- Auth ---

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signUp(
  email: string,
  password: string,
  redirectTo: string
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectTo,
    },
  });
  return { data, error };
}

export async function signOut() {
  await supabase.auth.signOut();
}
