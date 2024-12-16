'use client'

import { Trash03 } from '@untitled-ui/icons-react'
import { NodeProps } from '@xyflow/react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'

type PanelContainerNodeProps = NodeProps & {
  data: {
    onDelete?: () => void
  }
  children?: React.ReactNode
}

export function PanelContainer({ data, children }: PanelContainerNodeProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  return (
    <div className="relative min-h-[700px] min-w-[300px] rounded border border-dashed border-muted-foreground/75 bg-background/25 p-12 pt-16">
      <div className="absolute -top-4 right-4 z-10">
        <Button
          size="icon"
          variant="ghost"
          className="bg-background/75 text-foreground hover:bg-red-500"
          onClick={() => setShowDeleteConfirm(true)}
        >
          <Trash03 className="h-4 w-4" />
        </Button>
      </div>
      {children}
      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={data.onDelete!}
        title="Delete Panel"
        description="Are you sure you want to delete this panel? This action cannot be undone."
      />
    </div>
  )
}
