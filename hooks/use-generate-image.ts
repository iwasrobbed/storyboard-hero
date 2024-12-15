import { useState } from 'react'

type GenerateImageResponse = {
  image: {
    url: string
  } | null
  error?: string
}

export function useGenerateImage() {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)

  const generateImage = async (
    prompt: string,
  ): Promise<{
    imageUrl: string | null
    error: Error | null
  }> => {
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

      const data = (await response.json()) as GenerateImageResponse

      if (data.error) {
        throw new Error(data.error)
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
  }

  return {
    generateImage,
    isGeneratingImage,
  }
}
