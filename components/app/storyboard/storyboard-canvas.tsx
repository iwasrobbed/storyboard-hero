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
import { getImageNode } from '@/lib/storyboards/get-image-node'
import { getNodeId } from '@/lib/storyboards/get-node-id'
import { getPromptNode } from '@/lib/storyboards/get-prompt-node'
import type { PanelNode } from '@/lib/storyboards/types'
import { NodeType, PanelStatus } from '@/lib/storyboards/types'
import { updateImageNode } from '@/lib/storyboards/update-image-node'
import { updatePromptNode } from '@/lib/storyboards/update-prompt-node'
import { Button } from '@/components/ui/button'
import { nodeTypes } from './nodes/types'
import { useGenerateImage } from '@/hooks/use-generate-image'

export function StoryboardCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState<PanelNode>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const reactFlowInstance = useRef<ReactFlowInstance<PanelNode, Edge> | null>(
    null,
  )

  const { generateImage } = useGenerateImage()

  const createNewPanel = useCallback(() => {
    const panelCount = nodes.length / 4
    const xOffset = panelCount * 400 + 50

    const { nodes: newNodes, edges: newEdges } = createPanel({
      xOffset,
      onPromptChange: (panelId, prompt) => {
        updatePromptNode({
          reactFlow: reactFlowInstance.current,
          panelId,
          prompt,
        })
      },
      onGenerateImage: async (panelId) => {
        const promptNode = getPromptNode({
          reactFlow: reactFlowInstance.current,
          panelId,
        })

        if (!promptNode) {
          console.error('Prompt node not found for panel', panelId)
          return
        }

        updateImageNode({
          reactFlow: reactFlowInstance.current,
          panelId,
          updates: {
            status: PanelStatus.GENERATING,
          },
        })
        const { imageUrl, error } = await generateImage(promptNode.data.prompt)

        if (error) {
          updateImageNode({
            reactFlow: reactFlowInstance.current,
            panelId,
            updates: {
              status: PanelStatus.ERROR,
              error: error.message,
            },
          })
        } else if (imageUrl) {
          updateImageNode({
            reactFlow: reactFlowInstance.current,
            panelId,
            updates: {
              status: PanelStatus.COMPLETE,
              imageUrl,
            },
          })
        }
      },
      onGenerateVideo: async (panelId) => {
        const imageNode = getImageNode({
          reactFlow: reactFlowInstance.current,
          panelId,
        })

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
