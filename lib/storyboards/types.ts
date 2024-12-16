import type { Edge, Node as FlowNode } from '@xyflow/react'

export enum NodeType {
  PANEL = 'panel',
  CONTAINER = 'panel-container',
  PROMPT = 'panel-prompt',
  IMAGE = 'panel-image',
  VIDEO = 'panel-video',
}

export enum EdgeType {
  PROMPT_TO_IMAGE = 'prompt-to-image',
  IMAGE_TO_VIDEO = 'image-to-video',
}

export enum PanelStatus {
  DISABLED = 'disabled',
  IDLE = 'idle',
  GENERATING = 'generating',
  COMPLETE = 'complete',
  ERROR = 'error',
}

export type PanelOnPromptChange = (panelId: string, newPrompt: string) => void
export type PanelOnGenerateImage = (panelId: string) => Promise<void>
export type PanelOnGenerateVideo = (panelId: string) => Promise<void>

export type PanelContainerData = {
  panelId: string
  onDelete: () => void
  children?: React.ReactNode
}

export type PanelPromptData = {
  panelId: string
  prompt: string
  onPromptChange: PanelOnPromptChange
}

export type PanelImageData = {
  panelId: string
  imageUrl?: string
  status: PanelStatus
  error?: string
  onGenerateImage: PanelOnGenerateImage
}

export type PanelVideoData = {
  panelId: string
  videoUrl?: string
  status: PanelStatus
  error?: string
  onGenerateVideo: PanelOnGenerateVideo
}

export type PanelContainerNode = FlowNode<PanelContainerData>
export type PanelPromptNode = FlowNode<PanelPromptData>
export type PanelImageNode = FlowNode<PanelImageData>
export type PanelVideoNode = FlowNode<PanelVideoData>

export type PanelNode =
  | PanelContainerNode
  | PanelPromptNode
  | PanelImageNode
  | PanelVideoNode

export const isPanelContainerNode = (
  node: FlowNode,
): node is PanelContainerNode => node.type === NodeType.CONTAINER

export const isPanelPromptNode = (node: FlowNode): node is PanelPromptNode =>
  node.type === NodeType.PROMPT

export const isPanelImageNode = (node: FlowNode): node is PanelImageNode =>
  node.type === NodeType.IMAGE

export const isPanelVideoNode = (node: FlowNode): node is PanelVideoNode =>
  node.type === NodeType.VIDEO

export type SetNodesFunction = (
  nodes: PanelNode[] | ((nodes: PanelNode[]) => PanelNode[]),
) => void

export type SetEdgesFunction = (
  edges: Edge[] | ((edges: Edge[]) => Edge[]),
) => void

export type GenerateImageResponse = {
  imageUrl: string | null
  error: Error | null
}

export type GenerateVideoResponse = {
  videoUrl: string | null
  error: Error | null
}
