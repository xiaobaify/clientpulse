import { supabase } from "./supabase";
import { generateShareId } from "./utils";
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
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*, stages(*, deliverables(*))")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("fetchProjects error:", error.message);
    return [];
  }
  if (!projects || projects.length === 0) return [];

  return projects.map((p: any) => {
    const stages = (p.stages ?? [])
      .sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((s: any) => ({
        id: s.id,
        name: s.name,
        order: s.sort_order,
        status: s.status,
        expectedDate: s.expected_date ?? undefined,
        completedDate: s.completed_date ?? undefined,
        files: (s.deliverables ?? []).map((d: any) => ({
          id: d.id,
          name: d.name,
          url: d.url,
          size: d.size,
          uploadedAt: d.uploaded_at,
        })),
      }));
    return {
      id: p.id,
      name: p.name,
      clientName: p.client_name,
      clientEmail: p.client_email ?? undefined,
      shareId: p.share_id,
      sharePassword: p.share_password ?? undefined,
      status: p.status,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
      stages,
    };
  });
}

export async function fetchProjectById(id: string): Promise<Project | null> {
  const { data: project, error } = await supabase
    .from("projects")
    .select("*, stages(*, deliverables(*))")
    .eq("id", id)
    .single();

  if (error || !project) return null;

  const p = project as any;
  const stages = (p.stages ?? [])
    .sort((a: any, b: any) => a.sort_order - b.sort_order)
    .map((s: any) => ({
      id: s.id,
      name: s.name,
      order: s.sort_order,
      status: s.status,
      expectedDate: s.expected_date ?? undefined,
      completedDate: s.completed_date ?? undefined,
      files: (s.deliverables ?? []).map((d: any) => ({
        id: d.id,
        name: d.name,
        url: d.url,
        size: d.size,
        uploadedAt: d.uploaded_at,
      })),
    }));
  return {
    id: p.id,
    name: p.name,
    clientName: p.client_name,
    clientEmail: p.client_email ?? undefined,
    shareId: p.share_id,
    sharePassword: p.share_password ?? undefined,
    status: p.status,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
    stages,
  };
}

export async function fetchProjectByShareId(
  shareId: string
): Promise<Project | null> {
  const { data: project, error } = await supabase
    .from("projects")
    .select("*, stages(*, deliverables(*))")
    .eq("share_id", shareId)
    .single();

  if (error || !project) return null;

  const p = project as any;
  const stages = (p.stages ?? [])
    .sort((a: any, b: any) => a.sort_order - b.sort_order)
    .map((s: any) => ({
      id: s.id,
      name: s.name,
      order: s.sort_order,
      status: s.status,
      expectedDate: s.expected_date ?? undefined,
      completedDate: s.completed_date ?? undefined,
      files: (s.deliverables ?? []).map((d: any) => ({
        id: d.id,
        name: d.name,
        url: d.url,
        size: d.size,
        uploadedAt: d.uploaded_at,
      })),
    }));
  return {
    id: p.id,
    name: p.name,
    clientName: p.client_name,
    clientEmail: p.client_email ?? undefined,
    shareId: p.share_id,
    sharePassword: p.share_password ?? undefined,
    status: p.status,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
    stages,
  };
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

const DEFAULT_PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    interval: "monthly",
    features: ["3 个项目", "1GB 存储", "基础支持"],
    maxProjects: 3,
    maxStorage: 1,
  },
  {
    id: "pro",
    name: "Pro",
    price: 99,
    interval: "monthly",
    features: ["无限项目", "10GB 存储", "优先支持", "API 访问"],
    maxProjects: -1,
    maxStorage: 10,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 299,
    interval: "monthly",
    features: ["无限项目", "100GB 存储", "专属支持", "API 访问", "自定义域名"],
    maxProjects: -1,
    maxStorage: 100,
  },
];

export async function fetchPlans(): Promise<Plan[]> {
  const { data, error } = await supabase
    .from("plans")
    .select("*")
    .order("price", { ascending: true });

  if (error) {
    console.error("fetchPlans error:", error.message);
    return DEFAULT_PLANS;
  }

  const plans = (data as PlanRow[]).map(mapPlan);
  return plans.length > 0 ? plans : DEFAULT_PLANS;
}

// --- Stats (derived from real data) ---

export async function fetchStats() {
  const [usersRes, projectsRes, activeRes, revenueRes] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("status", "active"),
    supabase
      .from("orders")
      .select("amount")
      .eq("status", "paid"),
  ]);

  const monthlyRevenue = (revenueRes.data ?? []).reduce(
    (sum, order) => sum + (order as { amount: number }).amount,
    0
  );

  return {
    totalUsers: usersRes.count ?? 0,
    activeUsers: activeRes.count ?? 0,
    monthlyRevenue,
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

// --- Mutations: Projects ---

export async function createProject(data: {
  name: string;
  clientName: string;
  clientEmail?: string;
}): Promise<Project> {
  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      name: data.name,
      client_name: data.clientName,
      client_email: data.clientEmail ?? null,
      share_id: generateShareId(),
      status: "draft",
    })
    .select()
    .single();

  if (error) throw error;
  return mapProject(project as ProjectRow, [], []);
}

export async function updateProject(
  id: string,
  data: { name?: string; clientName?: string; clientEmail?: string; status?: string }
): Promise<void> {
  const updates: Record<string, string | null> = {};
  if (data.name !== undefined) updates.name = data.name;
  if (data.clientName !== undefined) updates.client_name = data.clientName;
  if (data.clientEmail !== undefined) updates.client_email = data.clientEmail;
  if (data.status !== undefined) updates.status = data.status;
  updates.updated_at = new Date().toISOString();

  const { error } = await supabase
    .from("projects")
    .update(updates)
    .eq("id", id);

  if (error) throw error;
}

export async function deleteProject(id: string): Promise<void> {
  // Delete stages first (cascade)
  const { data: stages } = await supabase
    .from("stages")
    .select("id")
    .eq("project_id", id);

  if (stages && stages.length > 0) {
    const stageIds = stages.map((s) => s.id);
    // Delete deliverables for these stages
    await supabase
      .from("deliverables")
      .delete()
      .in("stage_id", stageIds);
    // Delete stages
    await supabase.from("stages").delete().in("id", stageIds);
  }

  // Delete messages
  await supabase
    .from("client_messages")
    .delete()
    .eq("project_id", id);

  // Delete project
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
}

// --- Mutations: Stages ---

export async function createStage(
  projectId: string,
  data: { name: string }
): Promise<Stage> {
  // Get current max sort_order
  const { data: existing } = await supabase
    .from("stages")
    .select("sort_order")
    .eq("project_id", projectId)
    .order("sort_order", { ascending: false })
    .limit(1);

  const nextOrder = existing && existing.length > 0 ? existing[0].sort_order + 1 : 0;

  const { data: stage, error } = await supabase
    .from("stages")
    .insert({
      project_id: projectId,
      name: data.name,
      sort_order: nextOrder,
      status: "pending",
    })
    .select()
    .single();

  if (error) throw error;
  return mapStage(stage as StageRow, []);
}

export async function updateStage(
  id: string,
  data: { name?: string; status?: string; expectedDate?: string; completedDate?: string }
): Promise<void> {
  const updates: Record<string, string | null> = {};
  if (data.name !== undefined) updates.name = data.name;
  if (data.status !== undefined) updates.status = data.status;
  if (data.expectedDate !== undefined) updates.expected_date = data.expectedDate;
  if (data.completedDate !== undefined) updates.completed_date = data.completedDate;

  const { error } = await supabase
    .from("stages")
    .update(updates)
    .eq("id", id);

  if (error) throw error;
}

export async function updateStageOrder(
  stages: { id: string; sort_order: number }[]
): Promise<void> {
  const { error } = await supabase.rpc("update_stage_orders", {
    updates: stages,
  });
  if (error) {
    // Fallback: individual updates if RPC not available
    for (const stage of stages) {
      const { error: e } = await supabase
        .from("stages")
        .update({ sort_order: stage.sort_order })
        .eq("id", stage.id);
      if (e) throw e;
    }
  }
}

export async function deleteStage(id: string): Promise<void> {
  // Delete deliverables first
  await supabase.from("deliverables").delete().eq("stage_id", id);
  const { error } = await supabase.from("stages").delete().eq("id", id);
  if (error) throw error;
}

// --- Mutations: Messages ---

export async function createMessage(
  projectId: string,
  content: string,
  authorName: string
): Promise<void> {
  const { error } = await supabase.from("client_messages").insert({
    project_id: projectId,
    content,
    author_name: authorName,
  });

  if (error) throw error;
}

// --- Mutations: Users ---

export async function updateUser(
  id: string,
  data: { name?: string; role?: string; status?: string; plan?: string }
): Promise<void> {
  const updates: Record<string, string> = {};
  if (data.name !== undefined) updates.name = data.name;
  if (data.role !== undefined) updates.role = data.role;
  if (data.status !== undefined) updates.status = data.status;
  if (data.plan !== undefined) updates.plan = data.plan;

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", id);

  if (error) throw error;
}

// --- Mutations: Orders ---

export async function createOrder(data: {
  userId: string;
  planId: string;
  amount: number;
  paymentMethod: string;
}): Promise<string> {
  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      user_id: data.userId,
      plan_id: data.planId,
      amount: data.amount,
      payment_method: data.paymentMethod,
      status: "pending",
    })
    .select("id")
    .single();

  if (error) throw error;
  return (order as { id: string }).id;
}

export async function completeOrder(orderId: string): Promise<void> {
  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("user_id, plan_id")
    .eq("id", orderId)
    .single();

  if (fetchError) throw fetchError;

  // Update order status
  const { error: updateError } = await supabase
    .from("orders")
    .update({ status: "paid" })
    .eq("id", orderId);

  if (updateError) throw updateError;

  // Update user plan
  const orderData = order as { user_id: string; plan_id: string };
  await updateUser(orderData.user_id, { plan: orderData.plan_id });
}

export async function fetchOrdersByUser(userId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("fetchOrders error:", error.message);
    return [];
  }
  return data;
}
