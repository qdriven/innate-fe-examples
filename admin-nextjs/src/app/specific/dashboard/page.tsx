"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { SectionCards } from "@innate/admin-composites/section-cards"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@innate/ui"

export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <SectionCards />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>收入趋势</CardTitle>
              <CardDescription>过去 12 个月的收入变化</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-[200px] items-end gap-2">
                {[65, 78, 52, 89, 95, 72, 88, 91, 67, 82, 75, 96].map(
                  (h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t bg-primary/80 hover:bg-primary transition-colors"
                      style={{ height: `${h}%` }}
                    />
                  )
                )}
              </div>
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>1月</span>
                <span>6月</span>
                <span>12月</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>最近交易</CardTitle>
              <CardDescription>实时交易流水</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>交易</TableHead>
                    <TableHead>金额</TableHead>
                    <TableHead>状态</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>订阅续费</TableCell>
                    <TableCell>¥299.00</TableCell>
                    <TableCell>成功</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>企业版升级</TableCell>
                    <TableCell>¥2,999.00</TableCell>
                    <TableCell>处理中</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>API 调用包</TableCell>
                    <TableCell>¥199.00</TableCell>
                    <TableCell>成功</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}
