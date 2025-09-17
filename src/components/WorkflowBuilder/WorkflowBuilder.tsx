'use client';

import React, { useState, useCallback } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { ReactFlow, Background, Controls, MiniMap, Node, Edge, addEdge, Connection, useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';
import NodePalette from '../NodePalette/NodePalette';
import WorkflowManager from '../WorkflowManager/WorkflowManager';

const WorkflowBuilder: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragStart = useCallback((event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  }, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const nodeType = event.dataTransfer.getData('application/reactflow');
      if (!nodeType) return;

      const position = {
        x: event.clientX - 250, // Adjust for palette width
        y: event.clientY - 100, // Adjust for header height
      };

      const newNode: Node = {
        id: `${nodeType}-${Date.now()}`,
        type: 'default',
        position,
        data: { 
          label: nodeType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          nodeType 
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const handleLoadWorkflow = useCallback((workflow: any) => {
    setNodes(workflow.nodes);
    setEdges(workflow.edges);
  }, [setNodes, setEdges]);

  const handleClearWorkflow = useCallback(() => {
    setNodes([]);
    setEdges([]);
  }, [setNodes, setEdges]);

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h4" component="h1">
          Visual Workflow Builder
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Drag and drop nodes to create your workflow
        </Typography>
      </Paper>
      
      <WorkflowManager
        currentNodes={nodes}
        currentEdges={edges}
        onLoadWorkflow={handleLoadWorkflow}
        onClearWorkflow={handleClearWorkflow}
      />
      
      <Box sx={{ display: 'flex', flex: 1, gap: 2 }}>
        <NodePalette onDragStart={onDragStart} />
        
        <Box sx={{ flex: 1, border: '1px solid #e0e0e0' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </Box>
      </Box>
    </Box>
  );
};

export default WorkflowBuilder;
