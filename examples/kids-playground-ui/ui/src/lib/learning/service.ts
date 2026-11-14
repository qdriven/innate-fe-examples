import { learningModules } from "./mock-data"
import type { LearningModule } from "./types"

const delay = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds))

export async function listLearningModules(): Promise<LearningModule[]> {
  await delay(120)
  return [...learningModules]
}
