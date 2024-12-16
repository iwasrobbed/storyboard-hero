'use client'

import { ImagePlus } from '@untitled-ui/icons-react'
import {
  Background,
  Controls,
  MarkerType,
  ReactFlow,
  Panel as ReactFlowPanel,
} from '@xyflow/react'
import type { Connection } from '@xyflow/react'
import { useCallback } from 'react'
import { createPanel } from '@/lib/storyboards/create-panel'
import { Button } from '@/components/ui/button'
import { nodeTypes } from './nodes/types'
import { useGenerateImage } from '@/hooks/use-generate-image'
import { useStoryboardState } from '@/hooks/use-storyboard-state'

export function StoryboardCanvas() {
  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    reactFlowInstance,
    onInit,
  } = useStoryboardState()

  const { generateImage } = useGenerateImage()

  const createNewPanel = useCallback(() => {
    const panelCount = nodes.length / 4
    const xOffset = panelCount * 400 + 50

    const { nodes: newNodes, edges: newEdges } = createPanel({
      xOffset,
      reactFlowInstance,
      setNodes,
      setEdges,
      generateImage,
    })

    setNodes((nds) => [...nds, ...newNodes])
    setEdges((eds) => [...eds, ...newEdges])
  }, [nodes, setNodes, setEdges, reactFlowInstance, generateImage])

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => [
        ...eds,
        // Connect panels to each other
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
        fitView
        colorMode={'dark'}
      >
        <Background />
        <Controls />
        <ReactFlowPanel position="top-center">
          <Button onClick={createNewPanel}>
            <ImagePlus className="mr-2 h-4 w-4" />
            Add Panel
          </Button>
        </ReactFlowPanel>
      </ReactFlow>
    </div>
  )
}
