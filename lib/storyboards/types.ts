import type { Node as FlowNode } from '@xyflow/react'

export type PanelStatus = 'idle' | 'generating' | 'complete' | 'error'

export type PanelOnPromptChange = (panelId: string, newPrompt: string) => void
export type PanelOnGenerateImage = (panelId: string) => Promise<void>
export type PanelOnGenerateVideo = (panelId: string) => Promise<void>

export type PanelContainerData = {
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
  status: PanelStatus
  imageUrl?: string
  onGenerateImage: PanelOnGenerateImage
}

export type PanelVideoData = {
  panelId: string
  status: PanelStatus
  videoUrl?: string
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
): node is PanelContainerNode => node.type === 'panel-container'

export const isPanelPromptNode = (node: FlowNode): node is PanelPromptNode =>
  node.type === 'panel-prompt'

export const isPanelImageNode = (node: FlowNode): node is PanelImageNode =>
  node.type === 'panel-image'

export const isPanelVideoNode = (node: FlowNode): node is PanelVideoNode =>
  node.type === 'panel-video'
