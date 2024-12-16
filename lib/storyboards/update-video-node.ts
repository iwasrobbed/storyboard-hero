import type { ReactFlowInstance } from '@xyflow/react'
import type { Edge } from '@xyflow/react'
import { getNodeId } from './get-node-id'
import type { PanelNode, PanelVideoNode } from './types'
import { NodeType } from './types'

type UpdateVideoNodeProps = {
  reactFlow: ReactFlowInstance<PanelNode, Edge> | null
  panelId: string
  updates: Partial<PanelVideoNode['data']>
}

export const updateVideoNode = ({
  reactFlow,
  panelId,
  updates,
}: UpdateVideoNodeProps): void => {
  reactFlow?.updateNode(
    getNodeId({ type: NodeType.VIDEO, panelId }),
    (node) =>
      ({
        ...node,
        data: {
          ...node.data,
          ...updates,
        },
      }) as PanelVideoNode,
  )
}
