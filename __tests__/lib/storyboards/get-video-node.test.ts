import type { Edge, ReactFlowInstance } from '@xyflow/react'
import { getNodeId } from '@/lib/storyboards/get-node-id'
import { getVideoNode } from '@/lib/storyboards/get-video-node'
import {
  NodeType,
  type PanelNode,
  PanelVideoNode,
} from '@/lib/storyboards/types'
import { describe, expect, test } from 'bun:test'

describe('getVideoNode', () => {
  test('returns undefined when reactFlow is null', () => {
    const result = getVideoNode({ reactFlow: null, panelId: 'panel-1' })
    expect(result).toBeUndefined()
  })

  test('returns undefined when node is not found', () => {
    const mockReactFlow = {
      getNode: () => null,
    } as unknown as ReactFlowInstance<PanelNode, Edge>

    const result = getVideoNode({
      reactFlow: mockReactFlow,
      panelId: 'panel-1',
    })
    expect(result).toBeUndefined()
  })

  test('returns video node when found', () => {
    const mockVideoNode = {
      id: getNodeId({ type: NodeType.VIDEO, panelId: 'panel-1' }),
      type: NodeType.VIDEO,
      data: { panelId: 'panel-1', videoUrl: 'test.mp4' },
    } as PanelVideoNode

    const mockReactFlow = {
      getNode: () => mockVideoNode,
    } as unknown as ReactFlowInstance<PanelNode, Edge>

    const result = getVideoNode({
      reactFlow: mockReactFlow,
      panelId: 'panel-1',
    })
    expect(result).toEqual(mockVideoNode)
  })
})
