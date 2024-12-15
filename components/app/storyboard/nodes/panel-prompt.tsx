'use client'

import { Handle, Position } from '@xyflow/react'
import { useState } from 'react'
import { PanelPromptData } from '@/lib/storyboards/types'
import { Textarea } from '@/components/ui/textarea'

type PanelPromptProps = {
  data: PanelPromptData
}

export function PanelPrompt({ data }: PanelPromptProps) {
  const [prompt, setPrompt] = useState(data.prompt || '')

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newPrompt = e.target.value
    setPrompt(newPrompt)
    data.onPromptChange(data.panelId, newPrompt)
  }

  return (
    <div className="w-64 rounded border bg-card p-4 text-card-foreground shadow-sm">
      <div className="mb-2 text-sm font-semibold">Prompt</div>
      <Textarea
        value={prompt}
        onChange={handleChange}
        placeholder="Enter your scene description..."
        className="min-h-[100px] text-xs"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="bg-foreground"
      />
    </div>
  )
}
