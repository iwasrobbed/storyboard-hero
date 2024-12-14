import type { ReactFlowInstance } from '@xyflow/react'
import type { Edge } from '@xyflow/react'
import type { PanelNode, PanelVideoNode } from './types'
import { isPanelVideoNode } from './types'

export const getVideoNode = (
  reactFlowInstance: ReactFlowInstance<PanelNode, Edge> | null,
  nodeId: string,
): PanelVideoNode | undefined => {
  const node = reactFlowInstance?.getNode(nodeId)
  return node && isPanelVideoNode(node) ? node : undefined
}
