'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Computer } from '@mui/icons-material';
import { ReactFlow, Background, Controls, MiniMap, Node, addEdge, Connection, useNodesState, useEdgesState, MarkerType } from 'reactflow';
import 'reactflow/dist/style.css';
import ResizableNodePalette from '../NodePalette/ResizableNodePalette';
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
import './WorkflowBuilder.css';


const WorkflowBuilder: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [configuringNode, setConfiguringNode] = useState<{
    id: string
    type: 'wait' | 'send-email' | 'decision-split' | 'update-profile'
    data?: any
  } | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isMobile, setIsMobile] = useState(false);

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

      addNodeToCanvas(nodeType, position);
    },
    [setNodes]
  );

  const addNodeToCanvas = useCallback((nodeType: string, position?: { x: number; y: number }) => {
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

    // For mobile, center the node in the canvas
    const finalPosition = position || {
      x: 200,
      y: 200
    };

    const newNode: Node = {
      id: `${nodeType}-${Date.now()}`,
      type: 'default',
      position: finalPosition,
      data: { 
        label: defaultLabel,
        nodeType,
        config: defaultConfig
      },
    };

    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  const handleNodePaletteClick = useCallback((nodeType: string) => {
    addNodeToCanvas(nodeType);
  }, [addNodeToCanvas]);

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

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);



  return (
    <Box className="workflow-builder-container">
      <Paper className="workflow-builder-header">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <img src="/tapistro-logo.avif" alt="Tapistro" height="32" />
          <Box>
            <Typography className="workflow-builder-title" component="h1">
              Tapistro Flow
            </Typography>
            <Typography className="workflow-builder-subtitle">
              Visual Workflow Builder
            </Typography>
          </Box>
        </Box>
      </Paper>
      
      {!isMobile && (
        <WorkflowManager
          currentNodes={nodes}
          currentEdges={edges}
          onLoadWorkflow={handleLoadWorkflow}
          onClearWorkflow={handleClearWorkflow}
          validationResult={validationResult}
        />
      )}
      
      <Box className="workflow-builder-main">
        <ResizableNodePalette onDragStart={onDragStart} onNodeClick={handleNodePaletteClick} />
        
        <Box className="workflow-builder-canvas-container">
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
        
          <Box className="workflow-builder-canvas">
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
            <Box className="workflow-builder-empty-state">
              <Typography className="workflow-builder-empty-title" gutterBottom>
                Workflow is Empty
              </Typography>
              <Typography className="workflow-builder-empty-subtitle" sx={{ mb: 2 }}>
                Drag nodes from the palette to start building your workflow
              </Typography>
              <Typography className="workflow-builder-empty-description">
                Available nodes: Wait, Send Email, Decision Split, Update Profile
              </Typography>
            </Box>
          )}
          </Box>
        </Box>
      </Box>
      
      {/* Mobile Warning Message */}
      {isMobile && (
        <Box className="mobile-warning">
          <Computer className="icon" />
          <Typography variant="h5" component="h2">
            Desktop Required
          </Typography>
          <Typography>
            Tapistro Flow is optimized for desktop and laptop computers. 
            Please use a larger screen for the best workflow building experience.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Professional workflow builders like Zapier, Microsoft Power Automate, 
            and Braze Journey Builder are also desktop-only applications.
          </Typography>
        </Box>
      )}
      
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
