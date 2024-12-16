import type { ReactFlowInstance } from '@xyflow/react'
import type { Edge } from '@xyflow/react'
import { useCallback } from 'react'
import { panelHeight, panelWidth } from '@/lib/storyboards/create-panel'
import type { PanelNode } from '@/lib/storyboards/types'

type UsePanelViewportProps = {
  reactFlowInstance: ReactFlowInstance<PanelNode, Edge> | null
}

export const usePanelViewport = ({
  reactFlowInstance,
}: UsePanelViewportProps) => {
  const centerPanelInViewport = useCallback(
    (xOffset: number, yOffset: number) => {
      // Get viewport dimensions
      const viewportBounds = reactFlowInstance?.getViewport() ?? {
        x: 0,
        y: 0,
        zoom: 1,
      }
      const viewportWidth = window.innerWidth / viewportBounds.zoom
      const viewportHeight = window.innerHeight / viewportBounds.zoom

      // Center the panel with some padding
      const topPadding = 200
      const centerX = -xOffset + (viewportWidth - panelWidth) / 2
      const centerY = -yOffset + (viewportHeight - panelHeight) / 2 + topPadding

      setTimeout(() => {
        reactFlowInstance?.setViewport(
          {
            x: centerX,
            y: centerY,
            zoom: 1,
          },
          { duration: 800 },
        )
      }, 100)
    },
    [reactFlowInstance],
  )

  return { centerPanelInViewport }
}
