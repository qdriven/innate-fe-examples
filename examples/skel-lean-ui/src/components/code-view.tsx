"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@innate/ui"

import { CodeBlock } from "@/components/code-block"
import type { SourceFile } from "@/lib/snapshot"

export function CodeView({ sources }: { sources: SourceFile[] }) {
  return (
    <Tabs defaultValue={sources[0]?.key ?? "source"}>
      <TabsList className="flex-wrap">
        {sources.map((source) => (
          <TabsTrigger key={source.key} value={source.key}>
            {source.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {sources.map((source) => (
        <TabsContent key={source.key} value={source.key}>
          <CodeBlock
            code={source.content}
            label={source.path}
            truncated={source.truncated}
            totalLines={source.totalLines}
          />
        </TabsContent>
      ))}
    </Tabs>
  )
}
