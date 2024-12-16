import type { Edge, ReactFlowInstance, Viewport } from '@xyflow/react'
import { createPanelCallbacks } from './create-panel-callbacks'
import type {
  GenerateImageResponse,
  PanelContainerData,
  PanelNode,
  SetEdgesFunction,
  SetNodesFunction,
} from './types'
import {
  isPanelContainerNode,
  isPanelImageNode,
  isPanelPromptNode,
  isPanelVideoNode,
} from './types'

type StoredFlow = {
  nodes: PanelNode[]
  edges: Edge[]
  viewport?: Viewport
}

type RestoreFlowParams = {
  stored: string
  reactFlowInstance: ReactFlowInstance<PanelNode, Edge> | null
  setNodes: SetNodesFunction
  setEdges: SetEdgesFunction
  generateImage: (prompt: string) => Promise<GenerateImageResponse>
}

export function restoreFlowWithCallbacks({
  stored,
  reactFlowInstance,
  setNodes,
  setEdges,
  generateImage,
}: RestoreFlowParams) {
  const flow: StoredFlow = JSON.parse(stored)
  const callbacks = createPanelCallbacks({
    reactFlowInstance,
    setNodes,
    setEdges,
    generateImage,
  })

  const nodesWithCallbacks = flow.nodes.map((node): PanelNode => {
    if (isPanelPromptNode(node)) {
      return {
        ...node,
        data: {
          ...node.data,
          onPromptChange: callbacks.onPromptChange,
          panelId: node.data.panelId,
          prompt: node.data.prompt,
        },
      } as const
    }
    if (isPanelImageNode(node)) {
      return {
        ...node,
        data: {
          ...node.data,
          onGenerateImage: callbacks.onGenerateImage,
          panelId: node.data.panelId,
          status: node.data.status,
        },
      }
    }
    if (isPanelVideoNode(node)) {
      return {
        ...node,
        data: {
          ...node.data,
          onGenerateVideo: callbacks.onGenerateVideo,
          panelId: node.data.panelId,
          status: node.data.status,
        },
      }
    }
    if (isPanelContainerNode(node)) {
      return {
        ...node,
        data: {
          ...node.data,
          onDelete: () =>
            callbacks.onDelete((node.data as PanelContainerData).panelId),
        },
      }
    }
    return node
  }) as PanelNode[]

  return {
    nodes: nodesWithCallbacks,
    edges: flow.edges || [],
    viewport: flow.viewport,
  }
}
