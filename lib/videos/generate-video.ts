import {
  RunwayModel,
  VideoGenerationMetadata,
  VideoGenerationSource,
} from './types'
import RunwayML from '@runwayml/sdk'

export type GenerateVideoOptions = {
  imageUrl: string
  prompt: string
  model?: RunwayModel
}

export type GenerateVideoResult = {
  url: string
  metadata: VideoGenerationMetadata
}

export async function generateVideo({
  imageUrl,
  prompt,
  model = RunwayModel.GEN3A_TURBO,
}: GenerateVideoOptions): Promise<GenerateVideoResult> {
  const apiKey = process.env.RUNWAYML_API_SECRET
  if (!apiKey) {
    throw new Error('No Runway API key found')
  }

  // Initialize with retries and timeout
  const client = new RunwayML({
    apiKey,
    maxRetries: 2,
    timeout: 5 * 60 * 1000, // 5 minutes for video generation
  })

  try {
    const imageToVideo = await client.imageToVideo.create({
      model,
      promptImage: imageUrl,
      promptText: prompt,
    })

    const taskId = imageToVideo.id

    // Poll until complete
    let task: any
    do {
      try {
        // Wait between polls
        await new Promise((resolve) => setTimeout(resolve, 10000))
        task = await client.tasks.retrieve(taskId)
      } catch (error) {
        if (error instanceof RunwayML.APIError) {
          // Handle rate limits specially
          if (error.status === 429) {
            await new Promise((resolve) => setTimeout(resolve, 30000)) // Wait longer on rate limit
            continue
          }
        }
        throw error
      }
    } while (!['SUCCEEDED', 'FAILED'].includes(task.status))

    if (task.status === 'FAILED') {
      throw new Error(
        `Video generation failed: ${task.error ?? 'Unknown error'}`,
      )
    }

    if (!task.output) {
      throw new Error('No output URL in completed task')
    }

    // The task.output should contain the video URL
    console.log('task.output', task.output)
    return {
      url: Array.isArray(task.output) ? task.output[0] : task.output,
      metadata: {
        source: VideoGenerationSource.Runway,
        model,
      },
    }
  } catch (error) {
    if (error instanceof RunwayML.APIError) {
      throw new Error(`Runway API error: ${error.status} - ${error.name}`)
    }
    throw error
  }
}
