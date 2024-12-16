'use client'

import type { Edge, OnInit, ReactFlowInstance } from '@xyflow/react'
import { useEdgesState, useNodesState } from '@xyflow/react'
import { useCallback, useEffect, useState } from 'react'
import { restoreFlowWithCallbacks } from '@/lib/storyboards/restore-flow-with-callbacks'
import type {
  GenerateImageResponse,
  GenerateVideoResponse,
  PanelNode,
} from '@/lib/storyboards/types'

const STORAGE_KEY = 'storyboard-state'

type UseStoryboardStateProps = {
  generateImage: (prompt: string) => Promise<GenerateImageResponse>
  generateVideo: (
    prompt: string,
    imageUrl: string,
  ) => Promise<GenerateVideoResponse>
}

export function useStoryboardState({
  generateImage,
  generateVideo,
}: UseStoryboardStateProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<PanelNode>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance<
    PanelNode,
    Edge
  > | null>(null)

  // Save the current flow state to localStorage
  const saveFlow = useCallback(() => {
    if (!reactFlowInstance) return

    const flow = reactFlowInstance.toObject()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(flow))
  }, [reactFlowInstance])

  // Restore flow state from localStorage
  const restoreFlow = useCallback(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return

    try {
      const parsed = JSON.parse(stored)

      if (!parsed.nodes?.length && !parsed.edges?.length) {
        localStorage.removeItem(STORAGE_KEY) // Clean up empty state
        return
      }

      const { nodes, edges, viewport } = restoreFlowWithCallbacks({
        stored,
        reactFlowInstance,
        generateImage,
        generateVideo,
        deletePanel,
      })

      setNodes(nodes)
      setEdges(edges)

      if (viewport && reactFlowInstance) {
        reactFlowInstance.setViewport(viewport)
      }
    } catch (err) {
      console.error('Failed to restore flow:', err)
      localStorage.removeItem(STORAGE_KEY) // Clean up invalid state
    }
  }, [reactFlowInstance, setNodes, setEdges, generateImage, generateVideo])

  const deletePanel = useCallback(
    (panelId: string) => {
      setNodes((nodes) => nodes.filter((n) => !n.id.includes(panelId)))
      setEdges((edges) => edges.filter((e) => !e.id.includes(panelId)))
      // Save flow after deletion
      setTimeout(saveFlow, 0)
    },
    [setNodes, setEdges, saveFlow],
  )

  const clearStoryboard = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setNodes([])
    setEdges([])
  }, [setNodes, setEdges, reactFlowInstance])

  // Auto-save whenever nodes or edges change
  const handleNodesChange: typeof onNodesChange = (...args) => {
    onNodesChange(...args)
    setTimeout(saveFlow, 0) // Defer save until after state update
  }

  const handleEdgesChange: typeof onEdgesChange = (...args) => {
    onEdgesChange(...args)
    setTimeout(saveFlow, 0)
  }

  const onInit = useCallback<OnInit<PanelNode, Edge>>((instance) => {
    setReactFlowInstance(instance)
  }, [])

  // Auto-restore flow state from localStorage
  useEffect(() => {
    if (reactFlowInstance) {
      restoreFlow()
    }
  }, [reactFlowInstance, restoreFlow])

  return {
    reactFlowInstance,
    onInit,
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange: handleNodesChange,
    onEdgesChange: handleEdgesChange,
    restoreFlow,
    clearStoryboard,
    deletePanel,
  }
}
