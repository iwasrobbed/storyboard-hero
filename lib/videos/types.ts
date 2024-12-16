export enum VideoGenerationSource {
  Runway = 'runway',
}

export enum RunwayModel {
  GEN3A_TURBO = 'gen3a_turbo',
}

export type RunwayStyleOptions = {
  source: VideoGenerationSource.Runway
  model: RunwayModel
}

export type VideoGenerationStyle = RunwayStyleOptions

export type VideoGenerationMetadata = {
  source: VideoGenerationSource
} & {
  source: VideoGenerationSource.Runway
  model: RunwayModel
}
