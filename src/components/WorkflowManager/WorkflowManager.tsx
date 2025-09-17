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
  Alert,
  CircularProgress
} from '@mui/material';
import { Save, FolderOpen, Delete, Add } from '@mui/icons-material';
import { DatabaseService } from '@/lib/database';
import { Workflow } from '@/lib/supabase';  

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
  const [loading, setLoading] = useState(false);

  // Load workflows from database on component mount
  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    try {
      setLoading(true);
      const workflowsData = await DatabaseService.getWorkflows();
      setWorkflows(workflowsData);
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to load workflows' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateWorkflow = async () => {
    if (!currentWorkflowId) {
      setAlert({ type: 'error', message: 'No workflow loaded to update' });
      return;
    }

    try {
      setLoading(true);
      const workflow = await DatabaseService.updateWorkflow(currentWorkflowId, {
        name: currentWorkflow?.name || 'Untitled Workflow',
        nodes: currentNodes,
        edges: currentEdges
      });
      
      setWorkflows(prev => prev.map(w => w.id === currentWorkflowId ? workflow : w));
      setAlert({ type: 'success', message: 'Workflow updated successfully' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to update workflow' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAsWorkflow = async () => {
    if (!workflowName.trim()) {
      setAlert({ type: 'error', message: 'Please enter a workflow name' });
      return;
    }

    try {
      setLoading(true);
      const workflow = await DatabaseService.createWorkflow({
        name: workflowName.trim(),
        nodes: currentNodes,
        edges: currentEdges
      });
      
      setWorkflows(prev => [...prev, workflow]);
      setCurrentWorkflowId(workflow.id);
      setAlert({ type: 'success', message: 'Workflow saved as new copy' });
      setSaveAsDialogOpen(false);
      setWorkflowName('');
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to save workflow' });
    } finally {
      setLoading(false);
    }
  };

  const handleLoadWorkflow = (workflow: Workflow) => {
    onLoadWorkflow(workflow);
    setCurrentWorkflowId(workflow.id);
    setLoadDialogOpen(false);
    setAlert({ type: 'success', message: `Loaded workflow: ${workflow.name}` });
  };

  const handleDeleteWorkflow = async (workflowId: string) => {
    try {
      setLoading(true);
      await DatabaseService.deleteWorkflow(workflowId);
      setWorkflows(prev => prev.filter(w => w.id !== workflowId));
      if (currentWorkflowId === workflowId) {
        setCurrentWorkflowId(null);
        onClearWorkflow();
      }
      setAlert({ type: 'success', message: 'Workflow deleted successfully' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to delete workflow' });
    } finally {
      setLoading(false);
    }
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
            startIcon={loading ? <CircularProgress size={20} /> : <Save />}
            onClick={handleUpdateWorkflow}
            disabled={currentNodes.length === 0 || loading}
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
          startIcon={loading ? <CircularProgress size={20} /> : <Save />}
          onClick={() => setSaveAsDialogOpen(true)}
          disabled={currentNodes.length === 0 || loading}
        >
          Save As...
        </Button>

        <Button
          variant="outlined"
          startIcon={<FolderOpen />}
          onClick={async () => {
            await loadWorkflows();
            setLoadDialogOpen(true);
          }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} /> : 'Load Workflow'}
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
          <Button onClick={() => setSaveAsDialogOpen(false)} disabled={loading}>Cancel</Button>
          <Button onClick={handleSaveAsWorkflow} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : 'Save'}
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
                    secondary={`${workflow.nodes.length} nodes, ${workflow.edges.length} connections • Updated: ${new Date(workflow.updated_at).toLocaleDateString()}`}
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
