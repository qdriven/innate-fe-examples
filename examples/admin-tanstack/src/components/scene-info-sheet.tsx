import { FileTextIcon, InfoIcon } from "lucide-react"
import type { PageMeta } from "../lib/spec-navigation"
import { MarkdownContent } from "./markdown-content"
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@innate/ui"
interface SceneInfoDialogProps {
  pageMeta: PageMeta
}

export function SceneInfoDialog({ pageMeta }: SceneInfoDialogProps) {
  return (
    <Dialog>
      <DialogTrigger
        render={<Button size="sm" variant="outline" id="scene-info-trigger" />}
      >
        <InfoIcon data-icon />
        场景说明
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] max-w-4xl gap-0 overflow-hidden p-0">
        <DialogHeader>
          <DialogTitle>{pageMeta.title}</DialogTitle>
          <DialogDescription>{pageMeta.description}</DialogDescription>
        </DialogHeader>
        <div className="flex min-h-0 flex-col gap-4 px-4 pb-4">
          {pageMeta.docContent ? (
            <div className="min-h-0 overflow-y-auto rounded-xl border bg-background p-4">
              <MarkdownContent content={pageMeta.docContent} />
            </div>
          ) : (
            <div
              className="flex flex-col text-sm text-muted-foreground"
              style={{ gap: "var(--spacing-block)" }}
            >
              <p>该说明会聚焦当前页面的定位、适用边界和可参考的规范入口。</p>
            </div>
          )}
          {pageMeta.docHref && (
            <DialogFooter className="p-0">
              <Button
                size="sm"
                variant="outline"
                className="w-full sm:w-auto"
                render={
                  <a
                    href={pageMeta.docHref}
                    target="_blank"
                    rel="noreferrer noopener"
                  />
                }
              >
                <FileTextIcon data-icon />
                查看完整规范文档
              </Button>
            </DialogFooter>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
