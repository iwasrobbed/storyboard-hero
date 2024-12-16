import { NextResponse } from 'next/server'
import { generateVideo } from '@/lib/videos/generate-video'
import { RunwayModel } from '@/lib/videos/runway/models'

export const maxDuration = 300 // 5 minutes

export async function POST(request: Request) {
  const { prompt, imageUrl } = await request.json()

  if (!prompt || !imageUrl) {
    return NextResponse.json(
      { error: 'Prompt and imageUrl are required' },
      { status: 400 },
    )
  }

  try {
    const result = await generateVideo({
      prompt,
      imageUrl,
      model: RunwayModel.GEN3A_TURBO,
    })

    return NextResponse.json({ video: result })
  } catch (error) {
    console.error('Video generation error:', error)
    return NextResponse.json(
      { error: `Failed to generate video: ${error}` },
      { status: 500 },
    )
  }
}
