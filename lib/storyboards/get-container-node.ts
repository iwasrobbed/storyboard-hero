import type { ReactFlowInstance } from '@xyflow/react'
import type { Edge } from '@xyflow/react'
import type { PanelContainerNode, PanelNode } from './types'
import { isPanelContainerNode } from './types'

export const getContainerNode = (
  reactFlowInstance: ReactFlowInstance<PanelNode, Edge> | null,
  nodeId: string,
): PanelContainerNode | undefined => {
  const node = reactFlowInstance?.getNode(nodeId)
  return node && isPanelContainerNode(node) ? node : undefined
}
