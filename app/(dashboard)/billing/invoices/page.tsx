import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Receipt } from "lucide-react";

export default function InvoicesPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">发票列表</h1>
        <p className="text-muted-foreground">查看和下载您的发票</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>历史发票</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>发票编号</TableHead>
                <TableHead>日期</TableHead>
                <TableHead>套餐</TableHead>
                <TableHead>金额</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={6}>
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                      <Receipt className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="font-medium text-sm">暂无发票记录</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      订阅套餐后，发票将显示在这里
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
