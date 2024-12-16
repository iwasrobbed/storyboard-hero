'use client'

import type { Edge, OnInit, ReactFlowInstance } from '@xyflow/react'
import { useEdgesState, useNodesState } from '@xyflow/react'
import { useCallback, useEffect, useState } from 'react'
import { restoreFlowWithCallbacks } from '@/lib/storyboards/restore-flow-with-callbacks'
import type { PanelNode } from '@/lib/storyboards/types'
import { useGenerateImage } from '@/hooks/use-generate-image'

const STORAGE_KEY = 'storyboard-state'

export function useStoryboardState() {
  const [nodes, setNodes, onNodesChange] = useNodesState<PanelNode>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance<
    PanelNode,
    Edge
  > | null>(null)

  const { generateImage } = useGenerateImage()

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
      const { nodes, edges, viewport } = restoreFlowWithCallbacks({
        stored,
        reactFlowInstance,
        setNodes,
        setEdges,
        generateImage,
      })

      setNodes(nodes)
      setEdges(edges)

      if (viewport && reactFlowInstance) {
        reactFlowInstance.setViewport(viewport)
      }
    } catch (err) {
      console.error('Failed to restore flow:', err)
    }
  }, [reactFlowInstance, setNodes, setEdges, generateImage])

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
  }
}
