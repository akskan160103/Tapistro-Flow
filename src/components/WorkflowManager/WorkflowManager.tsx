'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Chip,
  Alert
} from '@mui/material';
import { Save, FolderOpen, Delete, Add } from '@mui/icons-material';  

interface Workflow {
  id: string;
  name: string;
  nodes: any[];
  edges: any[];
  createdAt: string;
  updatedAt: string;
}

interface WorkflowManagerProps {
  currentNodes: any[];
  currentEdges: any[];
  onLoadWorkflow: (workflow: Workflow) => void;
  onClearWorkflow: () => void;
}

const WorkflowManager: React.FC<WorkflowManagerProps> = ({
  currentNodes,
  currentEdges,
  onLoadWorkflow,
  onClearWorkflow
}) => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [currentWorkflowId, setCurrentWorkflowId] = useState<string | null>(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveAsDialogOpen, setSaveAsDialogOpen] = useState(false);
  const [workflowName, setWorkflowName] = useState('');
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Load workflows from localStorage on component mount
  useEffect(() => {
    const savedWorkflows = localStorage.getItem('workflows');
    if (savedWorkflows) {
      setWorkflows(JSON.parse(savedWorkflows));
    }
  }, []);

  // Save workflows to localStorage whenever workflows change
  useEffect(() => {
    localStorage.setItem('workflows', JSON.stringify(workflows));
  }, [workflows]);

  const handleUpdateWorkflow = () => {
    if (!currentWorkflowId) {
      setAlert({ type: 'error', message: 'No workflow loaded to update' });
      return;
    }

    const workflow: Workflow = {
      id: currentWorkflowId,
      name: currentWorkflow?.name || 'Untitled Workflow',
      nodes: currentNodes,
      edges: currentEdges,
      createdAt: currentWorkflow?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setWorkflows(prev => prev.map(w => w.id === currentWorkflowId ? workflow : w));
    setAlert({ type: 'success', message: 'Workflow updated successfully' });
  };

  const handleSaveAsWorkflow = () => {
    if (!workflowName.trim()) {
      setAlert({ type: 'error', message: 'Please enter a workflow name' });
      return;
    }

    const workflow: Workflow = {
      id: `workflow-${Date.now()}`,
      name: workflowName.trim(),
      nodes: currentNodes,
      edges: currentEdges,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setWorkflows(prev => [...prev, workflow]);
    setCurrentWorkflowId(workflow.id);
    setAlert({ type: 'success', message: 'Workflow saved as new copy' });
    setSaveAsDialogOpen(false);
    setWorkflowName('');
  };

  const handleLoadWorkflow = (workflow: Workflow) => {
    onLoadWorkflow(workflow);
    setCurrentWorkflowId(workflow.id);
    setLoadDialogOpen(false);
    setAlert({ type: 'success', message: `Loaded workflow: ${workflow.name}` });
  };

  const handleDeleteWorkflow = (workflowId: string) => {
    setWorkflows(prev => prev.filter(w => w.id !== workflowId));
    if (currentWorkflowId === workflowId) {
      setCurrentWorkflowId(null);
      onClearWorkflow();
    }
    setAlert({ type: 'success', message: 'Workflow deleted successfully' });
  };

  const handleNewWorkflow = () => {
    setCurrentWorkflowId(null);
    onClearWorkflow();
    setAlert({ type: 'success', message: 'Started new workflow' });
  };

  const currentWorkflow = workflows.find(w => w.id === currentWorkflowId);

  return (
    <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', backgroundColor: '#f5f5f5' }}>
      {alert && (
        <Alert 
          severity={alert.type} 
          onClose={() => setAlert(null)}
          sx={{ mb: 2 }}
        >
          {alert.message}
        </Alert>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        {currentWorkflowId ? (
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleUpdateWorkflow}
            disabled={currentNodes.length === 0}
          >
            Update Workflow
          </Button>
        ) : (
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={() => setSaveAsDialogOpen(true)}
            disabled={currentNodes.length === 0}
          >
            Save Workflow
          </Button>
        )}

        <Button
          variant="outlined"
          startIcon={<Save />}
          onClick={() => setSaveAsDialogOpen(true)}
          disabled={currentNodes.length === 0}
        >
          Save As...
        </Button>

        <Button
          variant="outlined"
          startIcon={<FolderOpen />}
          onClick={() => setLoadDialogOpen(true)}
          disabled={workflows.length === 0}
        >
          Load Workflow
        </Button>

        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={handleNewWorkflow}
        >
          New Workflow
        </Button>

        {currentWorkflow && (
          <Chip
            label={`Current: ${currentWorkflow.name}`}
            color="primary"
            variant="outlined"
          />
        )}

        <Typography variant="body2" color="text.secondary">
          {currentNodes.length} nodes, {currentEdges.length} connections
        </Typography>
      </Box>

      {/* Save As Dialog */}
      <Dialog open={saveAsDialogOpen} onClose={() => setSaveAsDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Save Workflow</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Workflow Name"
            fullWidth
            variant="outlined"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            placeholder="Enter a name for this workflow"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveAsDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveAsWorkflow} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Load Dialog */}
      <Dialog open={loadDialogOpen} onClose={() => setLoadDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Load Workflow</DialogTitle>
        <DialogContent>
          {workflows.length === 0 ? (
            <Typography color="text.secondary">No saved workflows found</Typography>
          ) : (
            <List>
              {workflows.map((workflow) => (
                <ListItem 
                  key={workflow.id} 
                  divider
                  secondaryAction={
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleLoadWorkflow(workflow)}
                      >
                        Load
                      </Button>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteWorkflow(workflow.id)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={workflow.name}
                    secondary={`${workflow.nodes.length} nodes, ${workflow.edges.length} connections • Updated: ${new Date(workflow.updatedAt).toLocaleDateString()}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLoadDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkflowManager;
