import type { Edge } from '@xyflow/react'
import { MarkerType } from '@xyflow/react'
import type {
  PanelContainerNode,
  PanelImageNode,
  PanelNode,
  PanelOnGenerateImage,
  PanelOnGenerateVideo,
  PanelOnPromptChange,
  PanelPromptNode,
  PanelVideoNode,
} from './types'
import { v4 as uuidv4 } from 'uuid'

type CreatePanelParams = {
  xOffset: number
  onDelete: (panelId: string) => void
  onPromptChange: PanelOnPromptChange
  onGenerateImage: PanelOnGenerateImage
  onGenerateVideo: PanelOnGenerateVideo
}

export function createPanel({
  xOffset,
  onDelete,
  onPromptChange,
  onGenerateImage,
  onGenerateVideo,
}: CreatePanelParams): {
  nodes: PanelNode[]
  edges: Edge[]
} {
  const panelId = uuidv4()

  const containerNode: PanelContainerNode = {
    id: `panel-${panelId}`,
    type: 'panel-container',
    position: { x: xOffset, y: 0 },
    draggable: true,
    deletable: false, // note: there's a button specifically for deleting the panel
    data: {
      onDelete: () => onDelete(panelId),
    },
    style: { width: 300, height: 1100 },
  }

  const promptNode: PanelPromptNode = {
    id: `prompt-${panelId}`,
    type: 'panel-prompt',
    position: { x: 20, y: 50 },
    parentId: containerNode.id,
    draggable: false,
    deletable: false,
    extent: 'parent',
    data: {
      panelId,
      prompt: '',
      onPromptChange,
    },
  }

  const imageNode: PanelImageNode = {
    id: `image-${panelId}`,
    type: 'panel-image',
    position: { x: 20, y: 250 },
    parentId: containerNode.id,
    draggable: false,
    deletable: false,
    extent: 'parent',
    data: {
      panelId,
      status: 'idle',
      imageUrl: undefined,
      onGenerateImage,
    },
  }

  const videoNode: PanelVideoNode = {
    id: `video-${panelId}`,
    type: 'panel-video',
    position: { x: 20, y: 475 },
    parentId: containerNode.id,
    draggable: false,
    deletable: false,
    extent: 'parent',
    data: {
      panelId,
      status: 'idle',
      videoUrl: undefined,
      onGenerateVideo,
    },
  }

  const promptToImageEdge: Edge = {
    id: `prompt-to-image-${panelId}`,
    deletable: false,
    source: promptNode.id,
    target: imageNode.id,
    type: 'smoothstep',
    sourceHandle: 'bottom',
    targetHandle: 'top',
    markerEnd: {
      type: MarkerType.Arrow,
      width: 20,
      height: 20,
    },
  }

  const imageToVideoEdge: Edge = {
    id: `image-to-video-${panelId}`,
    deletable: false,
    source: imageNode.id,
    target: videoNode.id,
    type: 'smoothstep',
    sourceHandle: 'bottom',
    targetHandle: 'top',
    markerEnd: {
      type: MarkerType.Arrow,
      width: 20,
      height: 20,
    },
  }

  return {
    nodes: [containerNode, promptNode, imageNode, videoNode],
    edges: [promptToImageEdge, imageToVideoEdge],
  }
}
