import type { Edge, ReactFlowInstance } from '@xyflow/react'
import { getNodeId } from '@/lib/storyboards/get-node-id'
import { getPromptNode } from '@/lib/storyboards/get-prompt-node'
import {
  NodeType,
  type PanelNode,
  PanelPromptNode,
} from '@/lib/storyboards/types'
import { describe, expect, test } from 'bun:test'

describe('getPromptNode', () => {
  test('returns undefined when reactFlow is null', () => {
    const result = getPromptNode({ reactFlow: null, panelId: 'panel-1' })
    expect(result).toBeUndefined()
  })

  test('returns undefined when node is not found', () => {
    const mockReactFlow = {
      getNode: () => null,
    } as unknown as ReactFlowInstance<PanelNode, Edge>

    const result = getPromptNode({
      reactFlow: mockReactFlow,
      panelId: 'panel-1',
    })
    expect(result).toBeUndefined()
  })

  test('returns prompt node when found', () => {
    const mockPromptNode = {
      id: getNodeId({ type: NodeType.PROMPT, panelId: 'panel-1' }),
      type: NodeType.PROMPT,
      data: { panelId: 'panel-1', prompt: 'test prompt' },
    } as PanelPromptNode

    const mockReactFlow = {
      getNode: () => mockPromptNode,
    } as unknown as ReactFlowInstance<PanelNode, Edge>

    const result = getPromptNode({
      reactFlow: mockReactFlow,
      panelId: 'panel-1',
    })
    expect(result).toEqual(mockPromptNode)
  })
})
