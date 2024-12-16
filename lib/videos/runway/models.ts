export enum RunwayModel {
  GEN3A_TURBO = 'gen3a_turbo',
}

export type ModelConfig = {
  name: string
  model: RunwayModel
}

export const runwayModels: ModelConfig[] = [
  {
    name: 'Gen-3 Turbo',
    model: RunwayModel.GEN3A_TURBO,
  },
]
