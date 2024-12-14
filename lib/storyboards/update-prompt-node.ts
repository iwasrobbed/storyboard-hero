import type { ReactFlowInstance } from '@xyflow/react'
import type { Edge } from '@xyflow/react'
import type { PanelNode, PanelPromptNode } from './types'

export const updatePromptNode = (
  reactFlowInstance: ReactFlowInstance<PanelNode, Edge> | null,
  nodeId: string,
  prompt: string,
): void => {
  reactFlowInstance?.updateNode(
    nodeId,
    (node) =>
      ({
        ...node,
        data: {
          ...node.data,
          prompt,
        },
      }) as PanelPromptNode,
  )
}
