'use client'

import { Trash03 } from '@untitled-ui/icons-react'
import { NodeProps } from '@xyflow/react'
import { Button } from '@/components/ui/button'

type PanelContainerNodeProps = NodeProps & {
  data: {
    onDelete?: () => void
  }
  children?: React.ReactNode
}

export function PanelContainer({ data, children }: PanelContainerNodeProps) {
  return (
    <div className="relative min-h-[700px] min-w-[300px] rounded-xl border-2 border-dashed border-muted-foreground/20 p-12 pt-16">
      <div className="absolute -top-4 right-4 z-10">
        <Button variant="destructive" size="sm" onClick={data.onDelete}>
          <Trash03 className="h-4 w-4" />
        </Button>
      </div>
      {children}
    </div>
  )
}
