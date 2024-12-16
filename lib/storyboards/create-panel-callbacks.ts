import type { Edge, ReactFlowInstance } from '@xyflow/react'
import { getImageNode } from './get-image-node'
import { getPromptNode } from './get-prompt-node'
import type { GenerateImageResponse, PanelNode } from './types'
import { PanelStatus } from './types'
import { updateImageNode } from './update-image-node'
import { updatePromptNode } from './update-prompt-node'

type CreatePanelCallbacksParams = {
  reactFlowInstance: ReactFlowInstance<PanelNode, Edge> | null
  generateImage: (prompt: string) => Promise<GenerateImageResponse>
  deletePanel: (panelId: string) => void
}

export function createPanelCallbacks({
  reactFlowInstance,
  generateImage,
  deletePanel,
}: CreatePanelCallbacksParams) {
  return {
    onPromptChange: (panelId: string, prompt: string) => {
      updatePromptNode({
        reactFlow: reactFlowInstance,
        panelId,
        prompt,
      })
    },

    onGenerateImage: async (panelId: string) => {
      const promptNode = getPromptNode({
        reactFlow: reactFlowInstance,
        panelId,
      })

      if (!promptNode) {
        console.error('Prompt node not found for panel', panelId)
        return
      }

      updateImageNode({
        reactFlow: reactFlowInstance,
        panelId,
        updates: {
          status: PanelStatus.GENERATING,
        },
      })

      const { imageUrl, error } = await generateImage(promptNode.data.prompt)

      if (error) {
        updateImageNode({
          reactFlow: reactFlowInstance,
          panelId,
          updates: {
            status: PanelStatus.ERROR,
            error: error.message,
          },
        })
      } else if (imageUrl) {
        updateImageNode({
          reactFlow: reactFlowInstance,
          panelId,
          updates: {
            status: PanelStatus.COMPLETE,
            imageUrl,
          },
        })
      }
    },

    onGenerateVideo: async (panelId: string) => {
      const imageNode = getImageNode({
        reactFlow: reactFlowInstance,
        panelId,
      })

      if (imageNode) {
        console.log('generate video', panelId, imageNode.data.imageUrl)
      } else {
        console.error('Image node not found for panel', panelId)
      }
      return Promise.resolve()
    },

    onDelete: (panelId: string) => {
      deletePanel(panelId)
    },
  }
}
