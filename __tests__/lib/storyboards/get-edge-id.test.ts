import { getEdgeId } from '@/lib/storyboards/get-edge-id'
import { EdgeType } from '@/lib/storyboards/types'
import { describe, expect, test } from 'bun:test'

describe('getEdgeId', () => {
  test('generates correct edge ID for prompt-to-image', () => {
    const result = getEdgeId({
      type: EdgeType.PROMPT_TO_IMAGE,
      panelId: 'test-123',
    })
    expect(result).toBe('prompt-to-image-test-123')
  })

  test('generates correct edge ID for image-to-video', () => {
    const result = getEdgeId({
      type: EdgeType.IMAGE_TO_VIDEO,
      panelId: 'test-123',
    })
    expect(result).toBe('image-to-video-test-123')
  })
})
