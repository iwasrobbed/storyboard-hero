import { useCallback, useState } from 'react'

export type GenerateImageResponse = {
  imageUrl: string | null
  error: Error | null
}

type GenerateImageApiResponse = {
  image?: { url: string }
  error?: string
}

export function useGenerateImage() {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)

  const generateImage = useCallback(
    async (prompt: string): Promise<GenerateImageResponse> => {
      try {
        setIsGeneratingImage(true)
        const response = await fetch('/api/images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
        })

        if (!response.ok) {
          throw new Error('Failed to generate image')
        }

        const data = (await response.json()) as GenerateImageApiResponse

        if (data.error) {
          throw new Error(String(data.error))
        }

        if (!data.image?.url) {
          throw new Error('No image URL returned')
        }

        return { imageUrl: data.image.url, error: null }
      } catch (error) {
        return {
          imageUrl: null,
          error: error instanceof Error ? error : new Error('Unknown error'),
        }
      } finally {
        setIsGeneratingImage(false)
      }
    },
    [],
  )

  return {
    generateImage,
    isGeneratingImage,
  }
}
