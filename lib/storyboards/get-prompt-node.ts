import type { ReactFlowInstance } from '@xyflow/react'
import type { Edge } from '@xyflow/react'
import type { PanelNode, PanelPromptNode } from './types'
import { isPanelPromptNode } from './types'

export const getPromptNode = (
  reactFlowInstance: ReactFlowInstance<PanelNode, Edge> | null,
  nodeId: string,
): PanelPromptNode | undefined => {
  const node = reactFlowInstance?.getNode(nodeId)
  return node && isPanelPromptNode(node) ? node : undefined
}
