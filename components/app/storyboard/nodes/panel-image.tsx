'use client'

import { AlertCircle, Loading02, Play } from '@untitled-ui/icons-react'
import { Handle, Position } from '@xyflow/react'
import { useCallback } from 'react'
import Image from 'next/image'
import { PanelImageData, PanelStatus } from '@/lib/storyboards/types'
import { Button } from '@/components/ui/button'

type PanelImageProps = {
  data: PanelImageData
}

export function PanelImage({ data }: PanelImageProps) {
  const handleGenerateImage = useCallback(() => {
    data.onGenerateImage(data.panelId)
  }, [data])

  return (
    <div className="w-64 rounded border bg-card p-4 text-card-foreground shadow-sm">
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="bg-foreground"
      />

      <div className="mb-2 text-sm font-semibold">Generated Image</div>
      <div className="relative aspect-video w-full overflow-hidden rounded bg-muted">
        {data.status === PanelStatus.GENERATING ? (
          <div className="flex h-full items-center justify-center">
            <Loading02 className="h-6 w-6 animate-spin" />
          </div>
        ) : data.status === PanelStatus.ERROR ? (
          <div className="flex h-full flex-col items-center justify-center gap-2">
            <AlertCircle className="h-6 w-6 text-destructive" />
            <div className="text-center text-sm text-destructive">
              {data.error || 'Failed to generate image'}
            </div>
            <Button size="sm" variant="outline" onClick={handleGenerateImage}>
              Try Again
            </Button>
          </div>
        ) : data.imageUrl ? (
          <Image
            src={data.imageUrl}
            alt="Generated scene"
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2">
            <div className="text-sm text-muted-foreground">
              No image generated
            </div>
            <Button size="sm" onClick={handleGenerateImage}>
              <Play className="mr-2 h-4 w-4" />
              Generate Image
            </Button>
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="bg-foreground"
      />
    </div>
  )
}
