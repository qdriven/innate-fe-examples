import React from "react"
import { createRoot } from "react-dom/client"
import { HashRouter } from "react-router-dom"
import { initMock } from "./mock"
import App from "./App"
import "./style.css"

// Initialize mock data layer before rendering
initMock()

// HashRouter：保证应用既能独立运行（/#/...），也能作为 static 插件
// 嵌入 desktop-host 的 /plugins/<id>/ 子路径 iframe 中而路由不失效。
createRoot(document.getElementById("app") as HTMLElement).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
)
