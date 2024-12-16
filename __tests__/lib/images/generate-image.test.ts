import { generateImage } from '@/lib/images/generate-image'
import { ReplicateModel } from '@/lib/images/replicate/models'
import { ImageGenerationSource } from '@/lib/images/types'
import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test'

afterEach(() => {
  mock.restore()
})

beforeEach(() => {
  // Mock modules
  mock.module('probe-image-size', () => ({
    default: async () => ({ width: 1024, height: 1024 }),
  }))

  mock.module('@/lib/r2/transfer-file-to-r2', () => ({
    transferFileToR2: async () => ({
      url: 'https://test.storyboardhero.co/image.webp',
      key: 'test-key',
    }),
  }))

  mock.module('@/lib/images/replicate/generate-replicate-image', () => ({
    generateReplicateImage: async () => 'https://replicate.com/test-image.png',
  }))
})

describe('generateImage', () => {
  test('generates image with default settings', async () => {
    const result = await generateImage({
      prompt: 'test prompt',
      folderId: 'test-folder',
    })

    expect(result.url).toBe('https://test.storyboardhero.co/image.webp')
    expect(result.metadata.source).toBe(ImageGenerationSource.Replicate)
    expect(result.metadata.model).toBe(ReplicateModel.FLUX_1_1_PRO_ULTRA)
  })

  test('throws error without folderId', async () => {
    await expect(
      generateImage({
        prompt: 'test prompt',
        folderId: '',
      }),
    ).rejects.toThrow('folderId is required')
  })
})
