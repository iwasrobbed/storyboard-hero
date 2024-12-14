import { useState } from 'react'

export function useGeneratePanelImage() {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)

  const generateImage = async (prompt: string) => {
    try {
      setIsGeneratingImage(true)
      const response = await fetch('/api/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const { imageUrl } = await response.json()
      return { imageUrl, error: null }
    } catch (error) {
      return { imageUrl: null, error }
    } finally {
      setIsGeneratingImage(false)
    }
  }

  return {
    generateImage,
    isGeneratingImage,
  }
}
