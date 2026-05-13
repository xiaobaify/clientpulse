"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface UserGrowthChartProps {
  data: { month: string; users: number }[];
}

export function UserGrowthChart({ data }: UserGrowthChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>用户增长</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="text-sm font-medium">
                        {payload[0].payload.month}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {payload[0].value?.toLocaleString()} 用户
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="users"
              stroke="var(--chart-1)"
              fill="var(--chart-1)"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
