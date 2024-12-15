import { ReplicateModel } from './models'
import { generateSeed } from './support'

type ModelConfig = {
  defaultOptions: Record<string, any>
}

const modelConfigs: Record<string, ModelConfig> = {
  [ReplicateModel.FLUX_1_1_PRO_ULTRA]: {
    defaultOptions: {
      seed: generateSeed(),
      aspect_ratio: '3:2',
      safety_tolerance: 2,
      raw: true,
      output_format: 'jpg',
    },
  },
}

export const getModelConfig = (model: string): ModelConfig => {
  const config = modelConfigs[model]
  if (!config) {
    return {
      defaultOptions: {
        seed: generateSeed(),
      },
    }
  }
  return config
}
