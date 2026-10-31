import {
  createSceneCatalog,
  type PatternSceneSample,
  type SpecificSceneSample,
  type SpecificSceneSection,
} from "@innate/scene-catalog"

/**
 * 页面已与 dashboard 平铺（src/app/<feature>/page.tsx），路由不再加 /dashboard 前缀，
 * 因此 resolveRoute 使用恒等函数；dashboard 首页（/dashboard）由根 page.tsx redirect 进入。
 */
export const sceneCatalog = createSceneCatalog((route: string) => route)

export const {
  sceneSamples,
  specificSceneSamples,
  specificSceneSectionMeta,
  getPatternSceneById,
  getSpecificSceneById,
  getSpecificSceneByRoute,
  getSpecificSceneSectionMeta,
} = sceneCatalog

export type { PatternSceneSample, SpecificSceneSample, SpecificSceneSection }
