import { NodeType } from './types'

type GetNodeIdProps = {
  type: NodeType
  panelId: string
}

export const getNodeId = ({ type, panelId }: GetNodeIdProps) => {
  return `${type}-${panelId}`
}
