import { getModelConfig } from './model-configs'
import { ReplicateModel } from './models'
import Replicate from 'replicate'

type BaseGenerateImageProps = {
  model: ReplicateModel
  prompt: string
  options?: Record<string, any>
}

type ReplicateImageUrl = string

export const generateReplicateImage = async ({
  model,
  prompt,
  options = {},
}: BaseGenerateImageProps): Promise<ReplicateImageUrl> => {
  const apiKey = process.env.REPLICATE_API_KEY
  if (!apiKey) {
    throw new Error('No Replicate API key found')
  }

  const replicate = new Replicate({
    auth: apiKey,
    // see: https://github.com/replicate/replicate-javascript/releases/tag/v1.0.0
    // we don't want file streams for now
    useFileOutput: false,
  })

  const modelConfig = getModelConfig(model)
  const input = {
    prompt,
    ...modelConfig.defaultOptions,
    ...options,
  }

  const generatedImage = (await replicate.run(model, {
    input,
  })) as unknown as ReplicateImageUrl

  if (!generatedImage) {
    throw new Error('No image generated')
  }

  return generatedImage
}
