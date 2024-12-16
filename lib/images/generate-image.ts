import { transferFileToR2 } from '../r2/transfer-file-to-r2'
import { generateReplicateImage } from './replicate/generate-replicate-image'
import { ReplicateModel } from './replicate/models'
import {
  ImageGenerationSource,
  ImageGenerationStyle,
  ReplicateStyleOptions,
} from './types'
import probe from 'probe-image-size'

export type GenerateImageOptions = {
  prompt: string
  style?: ImageGenerationStyle
  seed?: number
  folderId: string
}

export type GenerateImageResult = {
  url: string
  fileExtension: string
  width: number
  height: number
  metadata: {
    source: ImageGenerationSource
    seed?: number
  } & {
    source: ImageGenerationSource.Replicate
    model: ReplicateModel
  }
}

export async function generateImage(
  options: GenerateImageOptions,
): Promise<GenerateImageResult> {
  const source = options.style?.source ?? ImageGenerationSource.Replicate
  let result: GenerateImageResult

  if (!options.folderId) {
    throw new Error('folderId is required for image generation')
  }

  switch (source) {
    case ImageGenerationSource.Replicate:
      {
        const style = options.style as ReplicateStyleOptions | undefined
        const imageUrl = await generateReplicateImage({
          model: style?.model ?? ReplicateModel.FLUX_1_1_PRO_ULTRA,
          prompt: options.prompt,
          options: {
            seed: options.seed,
          },
        })

        const dimensions = await probe(imageUrl)

        result = {
          url: imageUrl,
          fileExtension: 'webp',
          width: dimensions.width,
          height: dimensions.height,
          metadata: {
            source: ImageGenerationSource.Replicate,
            model: style?.model ?? ReplicateModel.FLUX_1_1_PRO_ULTRA,
            seed: options.seed,
          },
        }
      }
      break

    default:
      throw new Error(`Unsupported image generation source: ${source}`)
  }

  const { url } = await transferFileToR2({
    sourceUrl: result.url,
    fileExtension: result.fileExtension,
    folderId: options.folderId,
  })
  result.url = url

  return result
}
