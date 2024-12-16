import { useCallback, useState } from 'react'

export type GenerateVideoResponse = {
  videoUrl: string | null
  error: Error | null
}

type GenerateVideoApiResponse = {
  video?: { url: string }
  error?: string
}

export function useGenerateVideo() {
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false)

  const generateVideo = useCallback(
    async (
      prompt: string,
      imageUrl: string,
    ): Promise<GenerateVideoResponse> => {
      try {
        setIsGeneratingVideo(true)
        const response = await fetch('/api/videos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, imageUrl }),
        })

        if (!response.ok) {
          throw new Error('Failed to generate video')
        }

        const data = (await response.json()) as GenerateVideoApiResponse

        if (data.error) {
          throw new Error(String(data.error))
        }

        if (!data.video?.url) {
          throw new Error('No video URL returned')
        }

        return { videoUrl: data.video.url, error: null }
      } catch (error) {
        return {
          videoUrl: null,
          error: error instanceof Error ? error : new Error('Unknown error'),
        }
      } finally {
        setIsGeneratingVideo(false)
      }
    },
    [],
  )

  return {
    generateVideo,
    isGeneratingVideo,
  }
}
