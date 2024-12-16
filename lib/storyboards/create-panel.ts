import type { Edge, ReactFlowInstance } from '@xyflow/react'
import { MarkerType } from '@xyflow/react'
import { createPanelCallbacks } from './create-panel-callbacks'
import { getEdgeId } from './get-edge-id'
import { getNodeId } from './get-node-id'
import type {
  GenerateImageResponse,
  PanelContainerNode,
  PanelImageNode,
  PanelNode,
  PanelPromptNode,
  PanelVideoNode,
  SetEdgesFunction,
  SetNodesFunction,
} from './types'
import { EdgeType, NodeType, PanelStatus } from './types'
import { v4 as uuidv4 } from 'uuid'

type CreatePanelParams = {
  xOffset: number
  reactFlowInstance: ReactFlowInstance<PanelNode, Edge> | null
  setNodes: SetNodesFunction
  setEdges: SetEdgesFunction
  generateImage: (prompt: string) => Promise<GenerateImageResponse>
}

export function createPanel({
  xOffset,
  reactFlowInstance,
  setNodes,
  setEdges,
  generateImage,
}: CreatePanelParams) {
  const panelId = uuidv4()
  const callbacks = createPanelCallbacks({
    reactFlowInstance,
    setNodes,
    setEdges,
    generateImage,
  })

  const containerNode: PanelContainerNode = {
    id: getNodeId({ type: NodeType.PANEL, panelId }),
    type: NodeType.CONTAINER,
    position: { x: xOffset, y: 0 },
    draggable: true,
    deletable: false, // note: there's a button specifically for deleting the panel
    data: {
      panelId,
      onDelete: () => callbacks.onDelete(panelId),
    },
    style: { width: 300, height: 1100 },
  }

  const promptNode: PanelPromptNode = {
    id: getNodeId({ type: NodeType.PROMPT, panelId }),
    type: NodeType.PROMPT,
    position: { x: 20, y: 50 },
    parentId: containerNode.id,
    draggable: false,
    deletable: false,
    extent: 'parent',
    data: {
      panelId,
      prompt: '',
      onPromptChange: callbacks.onPromptChange,
    },
  }

  const imageNode: PanelImageNode = {
    id: getNodeId({ type: NodeType.IMAGE, panelId }),
    type: NodeType.IMAGE,
    position: { x: 20, y: 250 },
    parentId: containerNode.id,
    draggable: false,
    deletable: false,
    extent: 'parent',
    data: {
      panelId,
      status: PanelStatus.IDLE,
      imageUrl: undefined,
      onGenerateImage: callbacks.onGenerateImage,
    },
  }

  const videoNode: PanelVideoNode = {
    id: getNodeId({ type: NodeType.VIDEO, panelId }),
    type: NodeType.VIDEO,
    position: { x: 20, y: 475 },
    parentId: containerNode.id,
    draggable: false,
    deletable: false,
    extent: 'parent',
    data: {
      panelId,
      status: PanelStatus.IDLE,
      videoUrl: undefined,
      onGenerateVideo: callbacks.onGenerateVideo,
    },
  }

  const promptToImageEdge: Edge = {
    id: getEdgeId({ type: EdgeType.PROMPT_TO_IMAGE, panelId }),
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
    id: getEdgeId({ type: EdgeType.IMAGE_TO_VIDEO, panelId }),
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
