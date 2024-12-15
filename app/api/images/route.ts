import { NextResponse } from 'next/server'
import { generateImage } from '@/lib/images/generate-image'
import { ReplicateModel } from '@/lib/images/replicate/models'
import { ImageGenerationSource } from '@/lib/images/types'

// TODO: Should have accounts & auth via JWT
export async function POST(request: Request) {
  const { prompt } = await request.json()

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
  }

  try {
    const result = await generateImage({
      prompt,
      style: {
        source: ImageGenerationSource.Replicate,
        model: ReplicateModel.FLUX_1_1_PRO_ULTRA,
      },
      folderId: '/storyboard-hero',
    })

    return NextResponse.json({ image: result })
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to generate image: ${error}` },
      { status: 500 },
    )
  }
}
