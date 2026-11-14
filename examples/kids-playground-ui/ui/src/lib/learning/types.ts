export type LearningModuleId = "letters" | "numbers" | "drawing" | "stories"

export type LearningModule = {
  id: LearningModuleId
  title: string
  emoji: string
  tagline: string
  age: string
  minutes: number
  activity: string
}
