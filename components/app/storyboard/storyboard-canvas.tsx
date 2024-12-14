'use client'

import { ImagePlus } from '@untitled-ui/icons-react'
import {
  Background,
  Controls,
  MarkerType,
  OnInit,
  ReactFlow,
  ReactFlowInstance,
  Panel as ReactFlowPanel,
  useEdgesState,
  useNodesState,
} from '@xyflow/react'
import type { Connection, Edge } from '@xyflow/react'
import { useCallback, useRef } from 'react'
import { createPanel } from '@/lib/storyboards/create-panel'
import type {
  PanelImageNode,
  PanelNode,
  PanelPromptNode,
} from '@/lib/storyboards/types'
import { Button } from '@/components/ui/button'
import { PanelContainer } from './nodes/panel-container'
import { PanelImage } from './nodes/panel-image'
import { PanelPrompt } from './nodes/panel-prompt'
import { PanelVideo } from './nodes/panel-video'
import { useGeneratePanelImage } from '@/hooks/use-generate-panel-image'

const nodeTypes = {
  'panel-container': PanelContainer,
  'panel-prompt': PanelPrompt,
  'panel-image': PanelImage,
  'panel-video': PanelVideo,
}

export function StoryboardCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState<PanelNode>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const reactFlowInstance = useRef<ReactFlowInstance<PanelNode, Edge> | null>(
    null,
  )

  const { generateImage } = useGeneratePanelImage()

  const createNewPanel = useCallback(() => {
    const panelCount = nodes.length / 4
    const xOffset = panelCount * 400 + 50

    const { nodes: newNodes, edges: newEdges } = createPanel({
      xOffset,
      onPromptChange: (panelId, prompt) => {
        console.log('onPromptChange', panelId, prompt)
        reactFlowInstance.current?.updateNode(
          `prompt-${panelId}`,
          (node) =>
            ({
              data: {
                ...node.data,
                prompt,
              },
            }) as PanelPromptNode,
        )
      },
      onGenerateImage: async (panelId) => {
        console.log('onGenerateImage', panelId)
        const promptNode = reactFlowInstance.current?.getNode(
          `prompt-${panelId}`,
        ) as PanelPromptNode | undefined

        if (promptNode) {
          console.log('generate image', promptNode.data.prompt)
          await generateImage(promptNode.data.prompt)
        } else {
          console.error('Prompt node not found for panel', panelId)
        }
      },
      onGenerateVideo: async (panelId) => {
        const imageNode = reactFlowInstance.current?.getNode(
          `image-${panelId}`,
        ) as PanelImageNode | undefined

        if (imageNode) {
          console.log('generate video', panelId, imageNode.data.imageUrl)
        } else {
          console.error('Image node not found for panel', panelId)
        }
        return Promise.resolve()
      },
      onDelete: (panelId) => {
        setNodes((nodes) => nodes.filter((n) => !n.id.includes(panelId)))
        setEdges((edges) => edges.filter((e) => !e.id.includes(panelId)))
      },
    })

    setNodes((nds) => [...nds, ...newNodes])
    setEdges((eds) => [...eds, ...newEdges])
  }, [generateImage, nodes, setNodes, setEdges])

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => [
        ...eds,
        {
          ...params,
          id: `${params.source}-${params.target}`,
          type: 'smoothstep',
          sourceHandle: 'bottom',
          targetHandle: 'top',
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

  const onInit = useCallback<OnInit<PanelNode, Edge>>((instance) => {
    reactFlowInstance.current = instance
  }, [])

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
        maxZoom={1.5}
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
