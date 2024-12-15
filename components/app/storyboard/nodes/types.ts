import { NodeType } from '@/lib/storyboards/types'
import { PanelContainer } from './panel-container'
import { PanelImage } from './panel-image'
import { PanelPrompt } from './panel-prompt'
import { PanelVideo } from './panel-video'

export const nodeTypes = {
  [NodeType.CONTAINER]: PanelContainer,
  [NodeType.PROMPT]: PanelPrompt,
  [NodeType.IMAGE]: PanelImage,
  [NodeType.VIDEO]: PanelVideo,
}
