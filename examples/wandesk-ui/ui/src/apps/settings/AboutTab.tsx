const aboutCopy = {
  title: "关于 Wandesk",
  desc: "Wandesk 是一个开源的 AI 桌面与本地工作台。你可以通过描述来构建应用，在共享上下文里执行任务，本地管理个人信息，并把 Claude Code、Codex、OpenClaw、Hermes 等外部 agent 接入同一个桌面。",
  lab: "由 Sider AI 创建",
  more: "访问 wandesk.ai",
}

const WANDESK_URL = "https://wandesk.ai"

export default function AboutTab() {
  return (
    <section>
      <div
        className="rounded-[13px] border px-5 py-5"
        style={{ background: "#fff", borderColor: "rgba(0,0,0,0.08)" }}
      >
        <div
          className="text-[22px] font-semibold tracking-[-0.02em]"
          style={{ color: "#2a1f13" }}
        >
          {aboutCopy.title}
        </div>
        <div
          className="mt-2 text-[13px] font-medium leading-relaxed"
          style={{ color: "rgba(0,0,0,0.5)" }}
        >
          {aboutCopy.desc}
        </div>
        <div
          className="mt-4 h-px w-full"
          style={{ background: "rgba(0,0,0,0.08)" }}
        />
        <div className="mt-4 text-[12px]" style={{ color: "rgba(0,0,0,0.42)" }}>
          {aboutCopy.lab}
        </div>
        <a
          href={WANDESK_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex text-[12px] underline underline-offset-4 transition-colors"
          style={{
            color: "rgba(0,0,0,0.4)",
            textDecorationColor: "rgba(0,0,0,0.2)",
          }}
        >
          {aboutCopy.more}
        </a>
      </div>
    </section>
  )
}
