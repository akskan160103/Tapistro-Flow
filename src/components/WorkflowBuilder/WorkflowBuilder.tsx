'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { ReactFlow, Background, Controls, MiniMap, Node, addEdge, Connection, useNodesState, useEdgesState, MarkerType } from 'reactflow';
import 'reactflow/dist/style.css';
import NodePalette from '../NodePalette/NodePalette';
import WorkflowManager from '../WorkflowManager/WorkflowManager';
import { 
  WaitNodeConfig, 
  SendEmailNodeConfig,
  UpdateProfileNodeConfig,
  DecisionSplitNodeConfig,
  type WaitNodeData,
  type SendEmailNodeData,
  type UpdateProfileNodeData,
  type DecisionSplitNodeData
} from '../NodeConfigurations';
import { WorkflowValidator, type ValidationResult } from '../../lib/workflowValidation';
import './ValidationStatus.css';


const WorkflowBuilder: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [configuringNode, setConfiguringNode] = useState<{
    id: string
    type: 'wait' | 'send-email' | 'decision-split' | 'update-profile'
    data?: any
  } | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

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

      // Create default config based on node type
      let defaultConfig = null;
      let defaultLabel = nodeType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      switch (nodeType) {
        case 'wait':
          defaultConfig = { hours: 0, minutes: 1, seconds: 0 };
          defaultLabel = 'Wait for 1m';
          break;
        case 'send-email':
          defaultConfig = { subject: 'New Email', template: '', recipients: [], recipientType: 'all' };
          defaultLabel = 'Send Email: New Email';
          break;
        case 'decision-split':
          defaultConfig = { conditions: [], defaultPath: 'Default' };
          defaultLabel = 'Decision Split';
          break;
        case 'update-profile':
          defaultConfig = { updates: [] };
          defaultLabel = 'Update Profile';
          break;
      }

      const newNode: Node = {
        id: `${nodeType}-${Date.now()}`,
        type: 'default',
        position,
        data: { 
          label: defaultLabel,
          nodeType,
          config: defaultConfig
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


  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    const nodeType = node.data?.nodeType
    if (nodeType && ['wait', 'send-email', 'decision-split', 'update-profile'].includes(nodeType)) {
      setConfiguringNode({
        id: node.id,
        type: nodeType as 'wait' | 'send-email' | 'decision-split' | 'update-profile',
        data: node.data
      })
    }
  }, []);

  const handleDeleteNode = useCallback((nodeId: string) => {
    console.log('Deleting node:', nodeId);
    // Remove the node
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    
    // Remove all edges connected to this node
    setEdges((eds) => eds.filter((edge) => 
      edge.source !== nodeId && edge.target !== nodeId
    ));
    
    // Close configuration dialog if it was open for this node
    setConfiguringNode(null);
  }, [setNodes, setEdges]);

  // Check if workflow is empty (no nodes)
  const isWorkflowEmpty = nodes.length === 0;

  // Validate workflow whenever nodes or edges change
  const validateWorkflow = useCallback(() => {
    const result = WorkflowValidator.validateWorkflow(nodes, edges);
    setValidationResult(result);
    return result;
  }, [nodes, edges]);

  // Run validation when nodes or edges change
  useEffect(() => {
    validateWorkflow();
  }, [validateWorkflow]);


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
        validationResult={validationResult}
      />
      
      <Box sx={{ display: 'flex', flex: 1, gap: 2 }}>
        <NodePalette onDragStart={onDragStart} />
        
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Validation Status - Only show structural issues */}
          {validationResult && !validationResult.isValid && (
            <Box className="validation-error-container">
              <Typography variant="subtitle2" className="validation-error-title" gutterBottom>
                Workflow Structure Issues:
              </Typography>
              {validationResult.errors.map((error, index) => (
                <Typography key={index} variant="body2" className="validation-error-message">
                  • {error.message}
                </Typography>
              ))}
            </Box>
          )}
          
          {validationResult && validationResult.warnings.length > 0 && (
            <Box className="validation-warning-container">
              <Typography variant="subtitle2" className="validation-warning-title" gutterBottom>
                Workflow Warnings:
              </Typography>
              {validationResult.warnings.map((warning, index) => (
                <Typography key={index} variant="body2" className="validation-warning-message">
                  • {warning.message}
                </Typography>
              ))}
            </Box>
          )}
        
          <Box sx={{ flex: 1, border: '1px solid #e0e0e0', position: 'relative' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={handleNodeClick}
            defaultEdgeOptions={{
              type: 'smoothstep',
              animated: false,
              style: { 
                strokeWidth: 2, 
                stroke: '#b1b1b7' 
              },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: '#b1b1b7',
                width: 20,
                height: 20,
              },
            }}
            fitView
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
          
          {isWorkflowEmpty && (
            <Box sx={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: 4,
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              pointerEvents: 'none' // Allow clicks to pass through to ReactFlow
            }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Workflow is Empty
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Drag nodes from the palette to start building your workflow
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Available nodes: Wait, Send Email, Decision Split, Update Profile
              </Typography>
            </Box>
          )}
          </Box>
        </Box>
      </Box>
      
      {/* Node Configuration Dialogs */}
      {configuringNode?.type === 'wait' && (
        <WaitNodeConfig
          open={configuringNode.type === 'wait'}
          onClose={() => setConfiguringNode(null)}
          onSave={(config: WaitNodeData) => {
            // Format time display for label
            const formatTimeDisplay = (h: number, m: number, s: number) => {
              const parts = []
              if (h > 0) parts.push(`${h}h`)
              if (m > 0) parts.push(`${m}m`)
              if (s > 0) parts.push(`${s}s`)
              return parts.length > 0 ? parts.join(' ') : '0m'
            }
            
            // Update node data with configuration and new label
            setNodes(nodes.map(node => 
              node.id === configuringNode.id 
                ? { 
                    ...node, 
                    data: { 
                      ...node.data, 
                      config,
                      label: `Wait for ${formatTimeDisplay(config.hours, config.minutes, config.seconds)}`
                    }
                  }
                : node
            ))
            setConfiguringNode(null)
          }}
          onDelete={() => handleDeleteNode(configuringNode.id)}
          initialConfig={configuringNode.data?.config}
        />
      )}
      
      {configuringNode?.type === 'send-email' && (
        <SendEmailNodeConfig
          open={configuringNode.type === 'send-email'}
          onClose={() => setConfiguringNode(null)}
          onSave={(config: SendEmailNodeData) => {
            // Update node data with configuration and new label
            setNodes(nodes.map(node => 
              node.id === configuringNode.id 
                ? { 
                    ...node, 
                    data: { 
                      ...node.data, 
                      config,
                      label: `Send Email: ${config.subject || 'Untitled'}`
                    }
                  }
                : node
            ))
            setConfiguringNode(null)
          }}
          onDelete={() => handleDeleteNode(configuringNode.id)}
          initialConfig={configuringNode.data?.config}
        />
      )}
      
      {configuringNode?.type === 'update-profile' && (
        <UpdateProfileNodeConfig
          open={configuringNode.type === 'update-profile'}
          onClose={() => setConfiguringNode(null)}
          onSave={(config: UpdateProfileNodeData) => {
            // Update node data with configuration and new label
            const updateCount = config.updates.length;
            const labelText = updateCount === 0 
              ? 'Update Profile' 
              : `Update Profile (${updateCount} field${updateCount === 1 ? '' : 's'})`;
            
            setNodes(nodes.map(node => 
              node.id === configuringNode.id 
                ? { 
                    ...node, 
                    data: { 
                      ...node.data, 
                      config,
                      label: labelText
                    }
                  }
                : node
            ))
            setConfiguringNode(null)
          }}
          onDelete={() => handleDeleteNode(configuringNode.id)}
          initialConfig={configuringNode.data?.config}
        />
      )}
      
      {configuringNode?.type === 'decision-split' && (
        <DecisionSplitNodeConfig
          open={configuringNode.type === 'decision-split'}
          onClose={() => setConfiguringNode(null)}
          onSave={(config: DecisionSplitNodeData) => {
            // Update node data with configuration and new label
            const conditionCount = config.conditions.length;
            const labelText = conditionCount === 0 
              ? 'Decision Split' 
              : `Decision Split (${conditionCount} condition${conditionCount === 1 ? '' : 's'})`;
            
            setNodes(nodes.map(node => 
              node.id === configuringNode.id 
                ? { 
                    ...node, 
                    data: { 
                      ...node.data, 
                      config,
                      label: labelText
                    }
                  }
                : node
            ))
            setConfiguringNode(null)
          }}
          onDelete={() => handleDeleteNode(configuringNode.id)}
          initialConfig={configuringNode.data?.config}
        />
      )}
    </Box>
  );
};

export default WorkflowBuilder;
