import type { ReactFlowInstance } from '@xyflow/react'
import type { Edge } from '@xyflow/react'
import { getNodeId } from './get-node-id'
import type { PanelImageNode, PanelNode } from './types'
import { NodeType, isPanelImageNode } from './types'

type GetImageNodeProps = {
  reactFlow: ReactFlowInstance<PanelNode, Edge> | null
  panelId: string
}

export const getImageNode = ({
  reactFlow,
  panelId,
}: GetImageNodeProps): PanelImageNode | undefined => {
  const node = reactFlow?.getNode(getNodeId({ type: NodeType.IMAGE, panelId }))
  return node && isPanelImageNode(node) ? node : undefined
}
