import type { ReactFlowInstance } from '@xyflow/react'
import type { Edge } from '@xyflow/react'
import { getNodeId } from './get-node-id'
import type { PanelNode, PanelPromptNode } from './types'
import { NodeType, isPanelPromptNode } from './types'

type GetPromptNodeProps = {
  reactFlow: ReactFlowInstance<PanelNode, Edge> | null
  panelId: string
}

export const getPromptNode = ({
  reactFlow,
  panelId,
}: GetPromptNodeProps): PanelPromptNode | undefined => {
  const node = reactFlow?.getNode(getNodeId({ type: NodeType.PROMPT, panelId }))
  return node && isPanelPromptNode(node) ? node : undefined
}
