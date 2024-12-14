import type { ReactFlowInstance } from '@xyflow/react'
import type { Edge } from '@xyflow/react'
import type { PanelImageNode, PanelNode } from './types'
import { isPanelImageNode } from './types'

export const getImageNode = (
  reactFlowInstance: ReactFlowInstance<PanelNode, Edge> | null,
  nodeId: string,
): PanelImageNode | undefined => {
  const node = reactFlowInstance?.getNode(nodeId)
  return node && isPanelImageNode(node) ? node : undefined
}
