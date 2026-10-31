import { createSceneCatalog } from "@innate/scene-catalog"
import type {
  PatternSceneSample,
  SpecificSceneSample,
  SpecificSceneSection,
} from "@innate/scene-catalog"
import { withBasePath } from "./base-path"

export const sceneCatalog = createSceneCatalog(withBasePath)

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
