import type { ReactFlowInstance } from '@xyflow/react'
import type { Edge } from '@xyflow/react'
import { getNodeId } from './get-node-id'
import type { PanelNode, PanelVideoNode } from './types'
import { NodeType, isPanelVideoNode } from './types'

type GetVideoNodeProps = {
  reactFlow: ReactFlowInstance<PanelNode, Edge> | null
  panelId: string
}

export const getVideoNode = ({
  reactFlow,
  panelId,
}: GetVideoNodeProps): PanelVideoNode | undefined => {
  const node = reactFlow?.getNode(getNodeId({ type: NodeType.VIDEO, panelId }))
  return node && isPanelVideoNode(node) ? node : undefined
}
