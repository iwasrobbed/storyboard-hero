import type { Edge, ReactFlowInstance } from '@xyflow/react'
import { getImageNode } from './get-image-node'
import { getPromptNode } from './get-prompt-node'
import type { GenerateImageResponse, PanelNode } from './types'
import { PanelStatus } from './types'
import { updateImageNode } from './update-image-node'
import { updatePromptNode } from './update-prompt-node'
import { updateVideoNode } from './update-video-node'
import type { GenerateVideoResponse } from '@/hooks/use-generate-video'

type CreatePanelCallbacksParams = {
  reactFlowInstance: ReactFlowInstance<PanelNode, Edge> | null
  generateImage: (prompt: string) => Promise<GenerateImageResponse>
  generateVideo: (
    prompt: string,
    imageUrl: string,
  ) => Promise<GenerateVideoResponse>
  deletePanel: (panelId: string) => void
}

export function createPanelCallbacks({
  reactFlowInstance,
  generateImage,
  generateVideo,
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
        updateVideoNode({
          reactFlow: reactFlowInstance,
          panelId,
          updates: {
            status: PanelStatus.DISABLED,
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
        updateVideoNode({
          reactFlow: reactFlowInstance,
          panelId,
          updates: {
            status: PanelStatus.IDLE,
          },
        })
      }
    },

    onGenerateVideo: async (panelId: string) => {
      const imageNode = getImageNode({
        reactFlow: reactFlowInstance,
        panelId,
      })

      const promptNode = getPromptNode({
        reactFlow: reactFlowInstance,
        panelId,
      })

      if (!imageNode?.data.imageUrl || !promptNode?.data.prompt) {
        console.error('Missing image URL or prompt for video generation')
        return
      }

      updateVideoNode({
        reactFlow: reactFlowInstance,
        panelId,
        updates: {
          status: PanelStatus.GENERATING,
        },
      })

      const { videoUrl, error } = await generateVideo(
        promptNode.data.prompt,
        imageNode.data.imageUrl,
      )

      if (error) {
        updateVideoNode({
          reactFlow: reactFlowInstance,
          panelId,
          updates: {
            status: PanelStatus.ERROR,
            error: error.message,
          },
        })
      } else if (videoUrl) {
        updateVideoNode({
          reactFlow: reactFlowInstance,
          panelId,
          updates: {
            status: PanelStatus.COMPLETE,
            videoUrl,
          },
        })
      }
    },

    onDelete: (panelId: string) => {
      deletePanel(panelId)
    },
  }
}
