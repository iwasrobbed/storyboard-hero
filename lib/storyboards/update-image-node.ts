import type { ReactFlowInstance } from '@xyflow/react'
import type { Edge } from '@xyflow/react'
import { getNodeId } from './get-node-id'
import type { PanelImageNode, PanelNode } from './types'
import { NodeType } from './types'

type UpdateImageNodeProps = {
  reactFlow: ReactFlowInstance<PanelNode, Edge> | null
  panelId: string
  updates: Partial<PanelImageNode['data']>
}

export const updateImageNode = ({
  reactFlow,
  panelId,
  updates,
}: UpdateImageNodeProps): void => {
  reactFlow?.updateNode(
    getNodeId({ type: NodeType.IMAGE, panelId }),
    (node) =>
      ({
        ...node,
        data: {
          ...node.data,
          ...updates,
        },
      }) as PanelImageNode,
  )
}
