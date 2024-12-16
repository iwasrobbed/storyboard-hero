'use client'

import { Loading02, Play, RefreshCw01 } from '@untitled-ui/icons-react'
import { Handle, Position } from '@xyflow/react'
import { useCallback } from 'react'
import { PanelStatus, PanelVideoData } from '@/lib/storyboards/types'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type PanelVideoProps = {
  data: PanelVideoData
}

export function PanelVideo({ data }: PanelVideoProps) {
  const handleGenerateVideo = useCallback(() => {
    data.onGenerateVideo(data.panelId)
  }, [data])

  const isDisabled = data.status === PanelStatus.DISABLED

  return (
    <div
      className={cn(
        'w-64 rounded border bg-card p-4 text-card-foreground shadow-sm',
        isDisabled && 'cursor-not-allowed opacity-50',
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="bg-foreground"
      />

      <div className="mb-2 flex items-center justify-between gap-2 text-sm font-semibold">
        <div>Panel video</div>
        {data.videoUrl && (
          <Button
            size="icon"
            variant="ghost"
            onClick={handleGenerateVideo}
            disabled={data.status === PanelStatus.GENERATING}
          >
            <RefreshCw01 className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="relative aspect-video w-full overflow-hidden rounded bg-muted">
        {data.status === PanelStatus.GENERATING ? (
          <div className="flex h-full items-center justify-center">
            <Loading02 className="h-6 w-6 animate-spin" />
          </div>
        ) : data.videoUrl ? (
          <video
            src={data.videoUrl}
            controls
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2">
            <div className="text-sm text-muted-foreground">
              No video generated
            </div>
            <Button
              disabled={isDisabled}
              size="sm"
              onClick={handleGenerateVideo}
            >
              <Play className="mr-2 h-4 w-4" />
              Generate Video
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
