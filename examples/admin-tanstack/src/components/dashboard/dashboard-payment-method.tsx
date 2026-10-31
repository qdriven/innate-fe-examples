import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  cn,
} from "@innate/ui"
type PayMethod = "card" | "paypal" | "apple"

interface MethodOption {
  value: PayMethod
  label: string
  icon: React.ReactNode
}

const methods: Array<MethodOption> = [
  {
    value: "card",
    label: "银行卡",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="size-5"
        aria-hidden
      >
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
      </svg>
    ),
  },
  {
    value: "paypal",
    label: "PayPal",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-5"
        aria-hidden
      >
        <path d="M7.076 21.337H2.47a.641.641 0 01-.633-.74L4.944 2.79A.858.858 0 015.79 2.1h7.343c2.58 0 4.397.614 5.395 1.824.455.553.75 1.13.886 1.72.143.625.143 1.373-.003 2.284l-.012.073v.608l.218.126c.18.1.343.217.49.352.407.377.657.857.77 1.466.12.642.08 1.41-.123 2.28-.234.998-.61 1.864-1.116 2.57-.463.654-1.043 1.19-1.72 1.588-.65.382-1.417.633-2.28.742-.332.042-.67.063-1.008.063H15.4c-.293 0-.573.104-.793.29a1.2 1.2 0 00-.41.737l-.043.24-.566 3.592-.025.159a.144.144 0 01-.143.122H7.076z" />
      </svg>
    ),
  },
  {
    value: "apple",
    label: "Apple",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-5"
        aria-hidden
      >
        <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
      </svg>
    ),
  },
]

export function DashboardPaymentMethod() {
  const [method, setMethod] = React.useState<PayMethod>("card")

  return (
    <Card>
      <CardHeader>
        <CardTitle>支付方式</CardTitle>
        <CardDescription>向账户添加新的支付方式。</CardDescription>
      </CardHeader>
      <CardContent
        className="flex flex-col"
        style={{ gap: "var(--spacing-section)" }}
      >
        {/* 方式选择 */}
        <div className="grid grid-cols-3 gap-2">
          {methods.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setMethod(m.value)}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-lg border px-3 py-3 text-xs transition-colors",
                method === m.value
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
              )}
            >
              {m.icon}
              <span>{m.label}</span>
            </button>
          ))}
        </div>

        {/* 卡片表单 */}
        <div className="flex flex-col" style={{ gap: "var(--spacing-block)" }}>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="card-name" className="text-xs">
              持卡人姓名
            </Label>
            <Input id="card-name" placeholder="张三" className="text-sm" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="card-city" className="text-xs">
              城市
            </Label>
            <Input id="card-city" placeholder="北京" className="text-sm" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="card-number" className="text-xs">
              卡号
            </Label>
            <Input
              id="card-number"
              placeholder="**** **** **** ****"
              className="text-sm"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">有效期（月）</Label>
              <Select>
                <SelectTrigger size="sm" aria-label="有效月">
                  <SelectValue placeholder="月" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i + 1} value={String(i + 1)}>
                      {String(i + 1).padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">有效期（年）</Label>
              <Select>
                <SelectTrigger size="sm" aria-label="有效年">
                  <SelectValue placeholder="年" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => (
                    <SelectItem key={i} value={String(2026 + i)}>
                      {2026 + i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="card-cvc" className="text-xs">
                CVC
              </Label>
              <Input
                id="card-cvc"
                placeholder="***"
                maxLength={4}
                className="text-sm"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
