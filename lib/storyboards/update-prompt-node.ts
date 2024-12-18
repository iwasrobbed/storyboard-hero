import type { ReactFlowInstance } from '@xyflow/react'
import type { Edge } from '@xyflow/react'
import { getNodeId } from './get-node-id'
import type { PanelNode, PanelPromptNode } from './types'
import { NodeType } from './types'

type UpdatePromptNodeProps = {
  reactFlow: ReactFlowInstance<PanelNode, Edge> | null
  panelId: string
  prompt: string
}

export const updatePromptNode = ({
  reactFlow,
  panelId,
  prompt,
}: UpdatePromptNodeProps): void => {
  reactFlow?.updateNode(
    getNodeId({ type: NodeType.PROMPT, panelId }),
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
