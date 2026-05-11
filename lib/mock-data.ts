import { User, Project, Plan, Activity, ClientMessage } from "./types";

export const mockUsers: User[] = [
  {
    id: "1",
    name: "张三",
    email: "zhangsan@example.com",
    role: "admin",
    status: "active",
    plan: "enterprise",
    createdAt: "2024-01-15T08:00:00Z",
  },
  {
    id: "2",
    name: "李四",
    email: "lisi@example.com",
    role: "editor",
    status: "active",
    plan: "pro",
    createdAt: "2024-02-20T10:30:00Z",
  },
  {
    id: "3",
    name: "王五",
    email: "wangwu@example.com",
    role: "viewer",
    status: "inactive",
    plan: "free",
    createdAt: "2024-03-10T14:15:00Z",
  },
  {
    id: "4",
    name: "赵六",
    email: "zhaoliu@example.com",
    role: "editor",
    status: "active",
    plan: "pro",
    createdAt: "2024-04-05T09:45:00Z",
  },
  {
    id: "5",
    name: "孙七",
    email: "sunqi@example.com",
    role: "viewer",
    status: "suspended",
    plan: "free",
    createdAt: "2024-05-12T16:20:00Z",
  },
];

export const mockProjects: Project[] = [
  {
    id: "1",
    name: "品牌官网改版",
    clientName: "张三公司",
    clientEmail: "zhangsan@company.com",
    shareId: "abc123",
    sharePassword: "demo",
    stages: [
      {
        id: "s1",
        name: "需求分析",
        order: 0,
        status: "completed",
        expectedDate: "2024-01-20",
        completedDate: "2024-01-18",
        files: [],
      },
      {
        id: "s2",
        name: "UI设计",
        order: 1,
        status: "completed",
        expectedDate: "2024-02-01",
        completedDate: "2024-01-30",
        files: [
          {
            id: "f1",
            name: "首页设计稿_v2.fig",
            url: "#",
            size: 15728640,
            uploadedAt: "2024-01-28T10:00:00Z",
          },
        ],
      },
      {
        id: "s3",
        name: "前端开发",
        order: 2,
        status: "in_progress",
        expectedDate: "2024-02-15",
        files: [],
      },
      {
        id: "s4",
        name: "验收交付",
        order: 3,
        status: "pending",
        expectedDate: "2024-02-28",
        files: [],
      },
    ],
    status: "active",
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-02-05T14:30:00Z",
  },
  {
    id: "2",
    name: "App开发项目",
    clientName: "李四科技",
    clientEmail: "lisi@tech.com",
    shareId: "def456",
    stages: [
      {
        id: "s5",
        name: "需求分析",
        order: 0,
        status: "completed",
        expectedDate: "2024-03-10",
        completedDate: "2024-03-08",
        files: [],
      },
      {
        id: "s6",
        name: "原型设计",
        order: 1,
        status: "in_progress",
        expectedDate: "2024-03-25",
        files: [
          {
            id: "f2",
            name: "App原型_v1.pdf",
            url: "#",
            size: 5242880,
            uploadedAt: "2024-03-15T09:00:00Z",
          },
        ],
      },
    ],
    status: "active",
    createdAt: "2024-03-01T10:00:00Z",
    updatedAt: "2024-03-15T11:20:00Z",
  },
  {
    id: "3",
    name: "电商平台",
    clientName: "王五商贸",
    clientEmail: "wangwu@trade.com",
    shareId: "ghi789",
    stages: [
      {
        id: "s7",
        name: "需求分析",
        order: 0,
        status: "pending",
        expectedDate: "2024-04-15",
        files: [],
      },
    ],
    status: "draft",
    createdAt: "2024-04-01T15:00:00Z",
    updatedAt: "2024-04-01T15:00:00Z",
  },
];

export const mockPlans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    interval: "monthly",
    features: ["3 个项目", "1 GB 存储", "基础支持"],
    maxProjects: 3,
    maxStorage: 1,
  },
  {
    id: "pro",
    name: "Pro",
    price: 99,
    interval: "monthly",
    features: ["无限项目", "10 GB 存储", "优先支持", "客户门户", "自定义品牌"],
    maxProjects: -1,
    maxStorage: 10,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 299,
    interval: "monthly",
    features: ["无限项目", "100 GB 存储", "专属支持", "API 访问", "SSO", "自定义域名"],
    maxProjects: -1,
    maxStorage: 100,
  },
];

export const mockActivities: Activity[] = [
  {
    id: "1",
    type: "user_signup",
    description: "用户 孙七 注册了账号",
    timestamp: "2024-05-12T16:20:00Z",
  },
  {
    id: "2",
    type: "project_update",
    description: "项目「品牌官网改版」进入「前端开发」阶段",
    timestamp: "2024-02-05T14:30:00Z",
  },
  {
    id: "3",
    type: "subscription",
    description: "李四 升级到 Pro 套餐",
    timestamp: "2024-03-20T09:15:00Z",
  },
  {
    id: "4",
    type: "file_upload",
    description: "张三公司 上传了「首页设计稿_v2.fig」",
    timestamp: "2024-01-28T10:00:00Z",
  },
  {
    id: "5",
    type: "user_signup",
    description: "用户 赵六 注册了账号",
    timestamp: "2024-04-05T09:45:00Z",
  },
];

export const mockMessages: ClientMessage[] = [
  {
    id: "1",
    projectId: "1",
    content: "首页配色能不能再活泼一些？",
    authorName: "张三",
    createdAt: "2024-02-06T10:30:00Z",
  },
  {
    id: "2",
    projectId: "1",
    content: "logo需要高清版本",
    authorName: "张三",
    createdAt: "2024-02-05T08:00:00Z",
  },
];

export const mockInvoices = [
  {
    id: "inv-001",
    number: "INV-2024-001",
    date: "2024-05-01",
    amount: 99,
    status: "paid",
    plan: "Pro",
  },
  {
    id: "inv-002",
    number: "INV-2024-002",
    date: "2024-04-01",
    amount: 99,
    status: "paid",
    plan: "Pro",
  },
  {
    id: "inv-003",
    number: "INV-2024-003",
    date: "2024-03-01",
    amount: 0,
    status: "paid",
    plan: "Free",
  },
  {
    id: "inv-004",
    number: "INV-2024-004",
    date: "2024-02-01",
    amount: 299,
    status: "refunded",
    plan: "Enterprise",
  },
];

export const mockStats = {
  totalUsers: 12340,
  activeUsers: 8210,
  monthlyRevenue: 89500,
  totalProjects: 156,
  revenueData: [
    { month: "1月", revenue: 65000 },
    { month: "2月", revenue: 72000 },
    { month: "3月", revenue: 78000 },
    { month: "4月", revenue: 85000 },
    { month: "5月", revenue: 89500 },
  ],
  userGrowthData: [
    { month: "1月", users: 9800 },
    { month: "2月", users: 10200 },
    { month: "3月", users: 10800 },
    { month: "4月", users: 11500 },
    { month: "5月", users: 12340 },
  ],
};
