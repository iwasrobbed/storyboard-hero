'use client'

import { ImagePlus, Trash03 } from '@untitled-ui/icons-react'
import {
  Background,
  Controls,
  MarkerType,
  ReactFlow,
  Panel as ReactFlowPanel,
} from '@xyflow/react'
import type { Connection } from '@xyflow/react'
import { useCallback, useState } from 'react'
import { createPanel } from '@/lib/storyboards/create-panel'
import { calculateNewPanelOffset } from '@/lib/storyboards/get-panel-nodes'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { nodeTypes } from './nodes/types'
import { useGenerateImage } from '@/hooks/use-generate-image'
import { useGenerateVideo } from '@/hooks/use-generate-video'
import { usePanelViewport } from '@/hooks/use-panel-viewport'
import { useStoryboardState } from '@/hooks/use-storyboard-state'

export function StoryboardCanvas() {
  const { generateImage } = useGenerateImage()
  const { generateVideo } = useGenerateVideo()

  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    reactFlowInstance,
    onInit,
    clearStoryboard: clearStoryboardAndState,
    deletePanel,
  } = useStoryboardState({ generateImage, generateVideo })

  const { centerPanelInViewport } = usePanelViewport({ reactFlowInstance })

  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const createNewPanel = useCallback(() => {
    const { x: xOffset, y: yOffset } = calculateNewPanelOffset({
      reactFlow: reactFlowInstance,
    })

    const { nodes: newNodes, edges: newEdges } = createPanel({
      xOffset,
      yOffset,
      reactFlowInstance,
      generateImage,
      generateVideo,
      deletePanel,
    })

    setNodes((nds) => [...nds, ...newNodes])
    setEdges((eds) => [...eds, ...newEdges])

    centerPanelInViewport(xOffset, yOffset)
  }, [
    setNodes,
    setEdges,
    reactFlowInstance,
    generateImage,
    generateVideo,
    centerPanelInViewport,
    deletePanel,
  ])

  const clearStoryboard = useCallback(() => {
    clearStoryboardAndState()
    centerPanelInViewport(0, 0)
  }, [clearStoryboardAndState, centerPanelInViewport])

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => [
        ...eds,
        // (Eventually) Connect panels to each other to serialize & composite the video
        {
          ...params,
          id: `${params.source}-${params.target}`,
          type: 'smoothstep',
          sourceHandle: 'right',
          targetHandle: 'left',
          markerEnd: {
            type: MarkerType.Arrow,
            width: 20,
            height: 20,
          },
        },
      ])
    },
    [setEdges],
  )

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onInit={onInit}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        minZoom={0.1}
        maxZoom={10}
        zoomOnDoubleClick={false}
        fitView
        colorMode={'dark'}
      >
        <Background />
        <Controls />
        <ReactFlowPanel position="top-center">
          <div className="flex items-center gap-2">
            <Button onClick={createNewPanel}>
              <ImagePlus className="mr-2 h-4 w-4" />
              Add Panel
            </Button>
            <Button onClick={() => setShowClearConfirm(true)}>
              <Trash03 className="mr-2 h-4 w-4" />
              Clear
            </Button>
          </div>
        </ReactFlowPanel>
      </ReactFlow>
      <ConfirmDialog
        open={showClearConfirm}
        onOpenChange={setShowClearConfirm}
        onConfirm={clearStoryboard}
        title="Clear Storyboard"
        description="Are you sure you want to clear the entire storyboard? This action cannot be undone."
      />
    </div>
  )
}
