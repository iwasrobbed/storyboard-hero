import type { Edge, ReactFlowInstance } from '@xyflow/react'
import { calculateNewPanelOffset } from '@/lib/storyboards/get-panel-nodes'
import { NodeType, type PanelNode } from '@/lib/storyboards/types'
import { describe, expect, test } from 'bun:test'

describe('calculateNewPanelOffset', () => {
  test('returns default position when no panels exist', () => {
    const mockReactFlow = {
      getNodes: () => [],
      setNodes: () => {},
      addNodes: () => {},
      getNode: () => null,
      getInternalNode: () => null,
    } as unknown as ReactFlowInstance<PanelNode, Edge>

    const offset = calculateNewPanelOffset({ reactFlow: mockReactFlow })
    expect(offset).toEqual({ x: 0, y: 0 })
  })

  test('calculates correct offset from rightmost panel', () => {
    const mockReactFlow = {
      getNodes: () => [
        {
          type: NodeType.CONTAINER,
          position: { x: 100, y: 50 },
          id: 'panel-1',
          data: { panelId: 'panel-1' },
        },
        {
          type: NodeType.CONTAINER,
          position: { x: 500, y: 50 },
          id: 'panel-2',
          data: { panelId: 'panel-2' },
        },
      ],
      setNodes: () => {},
      addNodes: () => {},
      getNode: () => null,
      getInternalNode: () => null,
    } as unknown as ReactFlowInstance<PanelNode, Edge>

    const offset = calculateNewPanelOffset({ reactFlow: mockReactFlow })
    expect(offset).toEqual({ x: 900, y: 50 }) // 500 + 400
  })
})
