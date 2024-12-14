import { NextResponse } from 'next/server'

// TODO: Auth via JWT
export async function POST(request: Request) {
  const { prompt } = await request.json()

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
  }

  console.log('prompt is', prompt)

  try {
    const imageUrl = 'https://placehold.co/600x400'
    // const imageUrl = await generateImage(prompt)
    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 },
    )
  }
}
