import type { ReactFlowInstance } from '@xyflow/react'
import type { Edge } from '@xyflow/react'
import type { PanelNode } from './types'
import { isPanelContainerNode } from './types'

type GetPanelNodesProps = {
  reactFlow: ReactFlowInstance<PanelNode, Edge> | null
}

export const calculateNewPanelOffset = ({ reactFlow }: GetPanelNodesProps) => {
  const rightmostPanel = getRightmostPanelNode({ reactFlow })

  if (!rightmostPanel) {
    return { x: 0, y: 0 } // Default position for first panel
  }

  return {
    x: rightmostPanel.position.x + 400, // Offset from rightmost panel
    y: rightmostPanel.position.y, // Maintain same y position
  }
}

// =================
// Private functions
// =================

const getRightmostPanelNode = ({ reactFlow }: GetPanelNodesProps) => {
  const panelNodes = getPanelNodes({ reactFlow })

  return panelNodes.reduce(
    (rightmost, current) => {
      if (!rightmost || current.position.x > rightmost.position.x) {
        return current
      }
      return rightmost
    },
    null as PanelNode | null,
  )
}

const getPanelNodes = ({ reactFlow }: GetPanelNodesProps) => {
  if (!reactFlow) return []

  return reactFlow.getNodes().filter(isPanelContainerNode)
}
