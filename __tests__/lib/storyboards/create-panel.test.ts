import type { Edge, ReactFlowInstance } from '@xyflow/react'
import { createPanel } from '@/lib/storyboards/create-panel'
import {
  NodeType,
  type PanelImageNode,
  type PanelNode,
  type PanelPromptNode,
  PanelStatus,
  type PanelVideoNode,
} from '@/lib/storyboards/types'
import { describe, expect, test } from 'bun:test'

describe('createPanel', () => {
  const mockReactFlowInstance = null as ReactFlowInstance<
    PanelNode,
    Edge
  > | null
  const mockGenerateImage = async () => ({ imageUrl: null, error: null })
  const mockGenerateVideo = async () => ({ videoUrl: null, error: null })
  const mockDeletePanel = () => {}

  test('creates panel with correct structure', () => {
    const { nodes, edges } = createPanel({
      xOffset: 100,
      yOffset: 200,
      reactFlowInstance: mockReactFlowInstance,
      generateImage: mockGenerateImage,
      generateVideo: mockGenerateVideo,
      deletePanel: mockDeletePanel,
    })

    // Check nodes
    expect(nodes).toHaveLength(4)

    // Container node checks
    const containerNode = nodes.find((n) => n.type === NodeType.CONTAINER)
    expect(containerNode).toBeDefined()
    expect(containerNode?.position).toEqual({ x: 100, y: 200 })
    expect(containerNode?.draggable).toBe(true)
    expect(containerNode?.deletable).toBe(false)

    // Prompt node checks
    const promptNode = nodes.find(
      (n) => n.type === NodeType.PROMPT,
    ) as PanelPromptNode
    expect(promptNode).toBeDefined()
    expect(promptNode.data.prompt).toBe('')
    expect(typeof promptNode.data.onPromptChange).toBe('function')

    // Image node checks
    const imageNode = nodes.find(
      (n) => n.type === NodeType.IMAGE,
    ) as PanelImageNode
    expect(imageNode).toBeDefined()
    expect(imageNode.data.status).toBe(PanelStatus.IDLE)
    expect(imageNode.data.imageUrl).toBeUndefined()

    // Video node checks
    const videoNode = nodes.find(
      (n) => n.type === NodeType.VIDEO,
    ) as PanelVideoNode
    expect(videoNode).toBeDefined()
    expect(videoNode.data.status).toBe(PanelStatus.DISABLED)
    expect(videoNode.data.videoUrl).toBeUndefined()

    // Check edges
    expect(edges).toHaveLength(2)
  })
})
