import { EdgeType } from './types'

type GetEdgeIdProps = {
  type: EdgeType
  panelId: string
}

export const getEdgeId = ({ type, panelId }: GetEdgeIdProps) => {
  return `${type}-${panelId}`
}
