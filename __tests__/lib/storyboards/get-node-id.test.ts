import { getNodeId } from '@/lib/storyboards/get-node-id'
import { NodeType } from '@/lib/storyboards/types'
import { describe, expect, test } from 'bun:test'

describe('getNodeId', () => {
  test('generates correct node ID for panel', () => {
    const result = getNodeId({
      type: NodeType.PANEL,
      panelId: 'test-123',
    })
    expect(result).toBe('panel-test-123')
  })

  test('generates correct node ID for container', () => {
    const result = getNodeId({
      type: NodeType.CONTAINER,
      panelId: 'test-123',
    })
    expect(result).toBe('panel-container-test-123')
  })

  test('generates correct node ID for prompt', () => {
    const result = getNodeId({
      type: NodeType.PROMPT,
      panelId: 'test-123',
    })
    expect(result).toBe('panel-prompt-test-123')
  })
})
