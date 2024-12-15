import { ReplicateModel } from './replicate/models'

export enum ImageGenerationSource {
  Replicate = 'replicate',
}

export type ImageGenerationSettings = {
  source: ImageGenerationSource
} & {
  source: ImageGenerationSource.Replicate
  replicateModel: ReplicateModel
}

export type ReplicateStyleOptions = {
  source: ImageGenerationSource.Replicate
  model: ReplicateModel
}

export type ImageGenerationStyle = ReplicateStyleOptions
