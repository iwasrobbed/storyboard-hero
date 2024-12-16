import type { Edge, ReactFlowInstance } from '@xyflow/react'
import { getImageNode } from '@/lib/storyboards/get-image-node'
import { getNodeId } from '@/lib/storyboards/get-node-id'
import {
  NodeType,
  PanelImageNode,
  type PanelNode,
} from '@/lib/storyboards/types'
import { describe, expect, test } from 'bun:test'

describe('getImageNode', () => {
  test('returns undefined when reactFlow is null', () => {
    const result = getImageNode({ reactFlow: null, panelId: 'panel-1' })
    expect(result).toBeUndefined()
  })

  test('returns undefined when node is not found', () => {
    const mockReactFlow = {
      getNode: () => null,
    } as unknown as ReactFlowInstance<PanelNode, Edge>

    const result = getImageNode({
      reactFlow: mockReactFlow,
      panelId: 'panel-1',
    })
    expect(result).toBeUndefined()
  })

  test('returns image node when found', () => {
    const mockImageNode = {
      id: getNodeId({ type: NodeType.IMAGE, panelId: 'panel-1' }),
      type: NodeType.IMAGE,
      data: { panelId: 'panel-1', imageUrl: 'test.jpg' },
    } as PanelImageNode

    const mockReactFlow = {
      getNode: () => mockImageNode,
    } as unknown as ReactFlowInstance<PanelNode, Edge>

    const result = getImageNode({
      reactFlow: mockReactFlow,
      panelId: 'panel-1',
    })
    expect(result).toEqual(mockImageNode)
  })
})
