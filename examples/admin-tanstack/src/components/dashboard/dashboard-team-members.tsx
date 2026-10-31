import * as React from "react"
import { PlusIcon } from "lucide-react"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
} from "@innate/ui"
interface TeamMember {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
}

const members: Array<TeamMember> = [
  {
    id: "1",
    name: "Toby Belhome",
    email: "contact@bundui.io",
    role: "viewer",
  },
  {
    id: "2",
    name: "Jackson Lee",
    email: "pre@example.com",
    role: "developer",
  },
  {
    id: "3",
    name: "Hally Gray",
    email: "hally@site.com",
    role: "viewer",
  },
]

const roleLabels: Record<string, string> = {
  viewer: "查看者",
  developer: "开发者",
  admin: "管理员",
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function DashboardTeamMembers() {
  const [roles, setRoles] = React.useState<Record<string, string>>(
    Object.fromEntries(members.map((m) => [m.id, m.role]))
  )

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>团队成员</CardTitle>
        <CardDescription>邀请团队成员协作。</CardDescription>
        <CardAction>
          <Button variant="outline" size="icon" className="size-7 shrink-0">
            <PlusIcon data-icon />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {members.map((member) => (
          <div key={member.id} className="flex items-center gap-3">
            <Avatar className="size-7">
              {member.avatar && (
                <AvatarImage src={member.avatar} alt={member.name} />
              )}
              <AvatarFallback className="text-xs">
                {getInitials(member.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium" title={member.name}>{member.name}</p>
              <p className="truncate text-xs text-muted-foreground" title={member.email}>
                {member.email}
              </p>
            </div>
            <Select
              value={roles[member.id]}
              onValueChange={(v) =>
                setRoles((prev) => ({
                  ...prev,
                  [member.id]: v || prev[member.id] || "viewer",
                }))
              }
            >
              <SelectTrigger
                size="sm"
                className="w-28 text-xs"
                aria-label="选择角色"
              >
                <SelectValue>
                  {roleLabels[roles[member.id] ?? "viewer"]}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(roleLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value} className="text-xs">
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
