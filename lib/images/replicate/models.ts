export enum ReplicateModel {
  FLUX_1_1_PRO_ULTRA = 'black-forest-labs/flux-1.1-pro-ultra',
}

export type ModelConfig = {
  name: string
  model: ReplicateModel
}

export const replicateModels: ModelConfig[] = [
  {
    name: 'Flux 1.1 Pro Ultra',
    model: ReplicateModel.FLUX_1_1_PRO_ULTRA,
  },
]
