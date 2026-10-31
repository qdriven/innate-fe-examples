import { Link } from "@tanstack/react-router"
import type { SpecificSceneSample } from "../../lib/scene-catalog"
import {
  getPatternSceneById,
  getSpecificSceneSectionMeta,
} from "../../lib/scene-catalog"
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@innate/ui"
import {
  InfoListCard,
  SceneIntro,
  TableCard,
} from "@innate/scene-catalog/scene-blocks"
function getCoverageLabel(level: SpecificSceneSample["supportLevel"]) {
  if (level === "Ready") {
    return "已有模式可直接承载"
  }

  if (level === "Extend") {
    return "需要在现有模式上扩展"
  }

  return "当前作为参考案例沉淀"
}

function getPresentationMode(scene: SpecificSceneSample) {
  switch (scene.primaryPatternId) {
    case "dashboard":
    case "workspace-list":
    case "integration-health":
      return "全宽工作区"
    case "record-detail":
    case "approval-review":
      return "主区 + 侧栏"
    case "reporting-wizard":
      return "聚焦流程页"
    case "policy-settings":
      return "分组设置页"
    default:
      return scene.section === "ai" ? "多面板工作区" : "待专用 Demo 校准"
  }
}

function getStructureRows(scene: SpecificSceneSample) {
  switch (scene.primaryPatternId) {
    case "dashboard":
      return [
        ["Header", "标题、范围、主操作", "解释业务主题与当前分析范围"],
        ["Controls", "时间、维度、筛选器", "负责切换观察视角和分析口径"],
        ["Summary", "KPI 卡片组", "让用户首屏快速判断整体状态"],
        ["Main", "趋势图 / 结构图 / 主视图", "承载核心分析和异常判断"],
        ["Details", "下钻表格或明细卡", "支持进一步定位问题和进入下一层页面"],
      ]
    case "workspace-list":
      return [
        ["Header", "标题、主操作、批量动作", "承接新建、导入、导出等任务入口"],
        ["Controls", "搜索、筛选、范围选择", "让用户快速定位目标记录"],
        ["Summary", "统计卡片（可选）", "当业务需要时补充整体分布和待办规模"],
        [
          "Main",
          "列表表格 / 工作台",
          "承担浏览、排序、批处理和进入详情的主任务",
        ],
        ["Support", "状态说明、更新时间", "提供数据可信度和审计上下文"],
      ]
    case "record-detail":
      return [
        [
          "Header",
          "名称、状态、主操作",
          "第一屏回答这是什么、现在怎样、能做什么",
        ],
        ["Summary", "关键字段摘要", "展示对象的核心属性和当前结论"],
        ["Side Panel", "风险、审计、关联信息", "放置辅助判断信息与次级动作"],
        ["Main", "明细、附件、时间线", "承载最主要的业务内容阅读"],
        ["Support", "只读态 / 锁定态提示", "说明当前页面行为边界"],
      ]
    case "reporting-wizard":
      return [
        ["Stepper", "步骤导航", "明确流程进度并支持已完成步骤回溯"],
        [
          "Main Form",
          "当前步骤表单",
          "聚焦当前任务，不让用户在多个区域来回切换",
        ],
        ["Side Summary", "校验结果 / 风险提示", "实时反馈当前填写质量"],
        [
          "Footer Actions",
          "保存草稿、上一步、下一步、提交",
          "统一流程动作入口",
        ],
        ["Result", "摘要确认页", "提交前完成最终确认和风险告知"],
      ]
    case "approval-review":
      return [
        ["Header", "提交人、SLA、状态", "交代审批上下文和当前节点"],
        ["Main", "差异对比 / 影响范围", "把需要判断的内容放在主视区"],
        ["Side Panel", "意见与历史记录", "保留审批留痕与上下文摘要"],
        ["Actions", "批准、退回、追加备注", "固定位置，避免随滚动丢失"],
        ["Support", "锁定态与权限说明", "明确当前能做与不能做的事"],
      ]
    case "integration-health":
      return [
        ["Summary", "连接器总览指标", "优先判断整体接入健康度"],
        ["Main", "连接器状态列表", "统一查看来源系统、同步时间和失败状态"],
        ["Details", "失败原因与重试", "提供排障入口和最近同步日志"],
        ["Support", "数据新鲜度规则", "解释健康度和成功率口径"],
      ]
    case "policy-settings":
      return [
        ["Header", "配置名称、作用范围", "先说清这套规则影响谁"],
        ["Main", "策略分组与配置项", "承载开关、规则和值输入"],
        ["Side Summary", "当前生效配置快照", "帮助用户确认改动前后的差异"],
        ["Support", "风险提示、变更日志", "对高风险变更给出影响范围说明"],
      ]
    default:
      return [
        [
          "Reference",
          "先以场景说明页沉淀信息结构",
          "在 Demo 落地前先固定导航位置和业务语义",
        ],
        [
          "Candidate Pattern",
          "确认是否复用现有 Pattern",
          "若现有模式不足，再补新的基础骨架",
        ],
        [
          "Scene Contract",
          "补充状态、权限、空错态约束",
          "避免只有静态样式没有交互合同",
        ],
      ]
  }
}

function getStateRows(scene: SpecificSceneSample) {
  switch (scene.primaryPatternId) {
    case "dashboard":
      return [
        ["加载中", "指标和图表尚未返回", "展示骨架屏与最近更新时间占位"],
        [
          "无数据",
          "当前筛选条件下没有可分析对象",
          "提供调参建议与回到默认口径",
        ],
        ["数据滞后", "同步时间超过阈值", "显示 freshness 提示并提供排查入口"],
        ["异常告警", "关键指标越限或波动异常", "高亮异常卡片并支持下钻"],
      ]
    case "workspace-list":
      return [
        ["空列表", "首次开通或无记录", "给出创建、导入或放宽筛选入口"],
        [
          "批量处理中",
          "导入、分配、导出等异步任务运行中",
          "明确进度与可撤销边界",
        ],
        ["筛选无结果", "检索条件过严或数据缺失", "保留筛选条件并推荐放宽路径"],
        [
          "只读 / 受限",
          "当前角色不可编辑或期间已锁定",
          "隐藏批量写操作，仅保留查看",
        ],
      ]
    case "record-detail":
      return [
        [
          "加载中",
          "详情字段与关联对象尚未完整返回",
          "摘要区先占位，次级区域渐进加载",
        ],
        [
          "只读态",
          "审计期或权限限制下不可修改",
          "保留备注、附件或变更申请入口",
        ],
        ["归档态", "对象已失效或进入历史期", "强调历史只读和引用来源"],
        ["关系缺失", "关联对象不存在或权限受限", "给出缺失原因和恢复路径"],
      ]
    case "reporting-wizard":
      return [
        ["草稿中", "尚未完成全部步骤", "允许保存草稿并记录最近编辑时间"],
        [
          "校验失败",
          "字段、步骤或跨表关系不满足规则",
          "聚焦错误并支持跳转定位",
        ],
        ["冲突提醒", "他人已修改同一对象或模板已更新", "提示差异并要求确认"],
        ["提交成功", "流程进入下一节点", "展示结果摘要与后续动作"],
      ]
    case "approval-review":
      return [
        ["待审批", "当前节点等待处理", "固定展示 SLA、提交人和差异摘要"],
        ["已退回", "审批未通过，需要补充材料", "保留退回原因与重新提交入口"],
        ["升级处理", "超时或高风险触发升级", "高亮风险级别与责任链"],
        ["锁定态", "审批完成或窗口关闭", "只保留审计阅读和导出能力"],
      ]
    case "integration-health":
      return [
        ["健康", "同步稳定、无异常", "显示最近成功时间和成功率"],
        ["延迟", "同步未按时完成但任务仍可恢复", "提示影响范围并允许重试"],
        ["失败", "最近一次任务失败或凭证失效", "展示错误原因、日志和排障动作"],
        ["重试中", "系统正在自动恢复", "说明重试次数与下一次执行时间"],
      ]
    case "policy-settings":
      return [
        ["编辑草稿", "尚未发布的新配置", "允许比对当前生效版本"],
        ["风险变更", "涉及权限、锁定或口径变化", "必须提示影响范围与审批要求"],
        ["已生效", "新配置已发布", "展示生效时间与版本号"],
        ["可回滚", "支持回退到历史版本", "保留回滚说明与依赖检查"],
      ]
    default:
      return [
        ["加载中", "场景数据尚未准备完成", "提供骨架和局部渐进加载"],
        ["空状态", "该场景当前无内容或未开通", "说明原因并给出下一步"],
        ["无权限", "当前角色不可访问", "明确边界并给出申请路径"],
        ["失败重试", "请求、执行或依赖失败", "提供错误说明和可恢复动作"],
      ]
  }
}

export function SpecificSceneView({ scene }: { scene: SpecificSceneSample }) {
  const patternScene = scene.primaryPatternId
    ? getPatternSceneById(scene.primaryPatternId)
    : undefined
  const sectionMeta = getSpecificSceneSectionMeta(scene.section)
  const presentationMode = getPresentationMode(scene)

  return (
    <>
      <SceneIntro
        title={scene.title}
        description={scene.description}
        chips={[
          "场景家族",
          sectionMeta.title,
          scene.navGroup ?? "通用分组",
          getCoverageLabel(scene.supportLevel),
          presentationMode,
        ]}
      />
      <div className="grid grid-cols-1 gap-[var(--spacing-section)] xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>场景定位</CardTitle>
            <CardDescription>{sectionMeta.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{sectionMeta.title}</Badge>
              <Badge
                variant={scene.supportLevel === "Ready" ? "default" : "outline"}
              >
                {scene.supportLevel}
              </Badge>
              {scene.navGroup ? (
                <Badge variant="outline">{scene.navGroup}</Badge>
              ) : null}
              <Badge variant="outline">{presentationMode}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              这个页面当前先作为场景家族说明页使用，目标是先稳定左侧导航结构、页面骨架和状态合同，
              再逐步升级为真正可交互的专用 Demo。
            </p>
            {patternScene ? (
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  render={<Link to={patternScene.route} />}
                >
                  查看对应基准 Demo
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  render={
                    <a
                      href={patternScene.docHref}
                      target="_blank"
                      rel="noreferrer noopener"
                    />
                  }
                >
                  查看模式文档
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                该场景还没有完全对应的基础
                Pattern，更适合作为后续补充专用骨架的输入样本。
              </p>
            )}
          </CardContent>
        </Card>
        <InfoListCard
          title="落地建议"
          items={[
            { label: "一级类目", value: sectionMeta.title },
            { label: "二级分组", value: scene.navGroup ?? "待明确分组" },
            {
              label: "推荐主模式",
              value: patternScene ? patternScene.title : "待新增场景模式",
            },
            { label: "推荐展示模式", value: presentationMode },
          ]}
        />
      </div>
      <TableCard
        title="建议页面结构"
        description="用于说明这个场景家族在本系统中应如何映射到统一页面骨架。"
        headers={["区域", "承载内容", "设计意图"]}
        rows={getStructureRows(scene)}
      />
      <TableCard
        title="必备状态合同"
        description="不是只有正常态。每个场景都必须先定义加载、空态、权限和失败恢复边界。"
        headers={["状态", "说明", "常见动作"]}
        rows={getStateRows(scene)}
      />
    </>
  )
}
