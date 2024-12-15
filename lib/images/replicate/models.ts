export enum ReplicateModel {
  FLUX_1_1_PRO_ULTRA = 'black-forest-labs/flux-1.1-pro-ultra',
}

export type ModelConfig = {
  name: string
  model: ReplicateModel
  cost: number
}

export const replicateModels: ModelConfig[] = [
  {
    name: 'Flux 1.1 Pro Ultra',
    model: ReplicateModel.FLUX_1_1_PRO_ULTRA,
    cost: 0.06,
  },
]

export const getCostOfModel = (model: string) => {
  return replicateModels.find((m) => m.model === model)?.cost ?? 0.06
}
