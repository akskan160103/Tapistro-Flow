'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material'
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material'

interface DecisionSplitNodeConfigProps {
  open: boolean
  onClose: () => void
  onSave: (config: DecisionSplitNodeData) => void
  initialConfig?: DecisionSplitNodeData
}

export interface DecisionSplitNodeData {
  conditions: Array<{
    id: string
    field: string
    operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than'
    value: string
    label: string
  }>
  defaultPath: string
}

const DecisionSplitNodeConfig: React.FC<DecisionSplitNodeConfigProps> = ({
  open,
  onClose,
  onSave,
  initialConfig
}) => {
  const [conditions, setConditions] = useState<Array<{
    id: string
    field: string
    operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than'
    value: string
    label: string
  }>>([])
  const [defaultPath, setDefaultPath] = useState<string>('Default Path')

  // Load initial configuration when dialog opens
  useEffect(() => {
    if (open && initialConfig) {
      setConditions(initialConfig.conditions)
      setDefaultPath(initialConfig.defaultPath)
    } else if (open) {
      // Reset to defaults when creating new node
      setConditions([])
      setDefaultPath('Default Path')
    }
  }, [open, initialConfig])

  const addCondition = () => {
    const newCondition = {
      id: `condition-${Date.now()}`,
      field: 'user_property',
      operator: 'equals' as const,
      value: '',
      label: `Condition ${conditions.length + 1}`
    }
    setConditions([...conditions, newCondition])
  }

  const updateCondition = (id: string, updates: Partial<typeof conditions[0]>) => {
    setConditions(conditions.map(condition => 
      condition.id === id ? { ...condition, ...updates } : condition
    ))
  }

  const removeCondition = (id: string) => {
    setConditions(conditions.filter(condition => condition.id !== id))
  }

  const handleSave = () => {
    const config: DecisionSplitNodeData = {
      conditions,
      defaultPath
    }
    onSave(config)
    onClose()
  }

  const handleCancel = () => {
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6" component="div">
          Configure Decision Split Node
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Conditions</Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addCondition}
            >
              Add Condition
            </Button>
          </Box>
          
          {conditions.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                No conditions defined. Click "Add Condition" to create branching logic.
              </Typography>
            </Box>
          ) : (
            <List>
              {conditions.map((condition, index) => (
                <ListItem key={condition.id} sx={{ border: 1, borderColor: 'grey.300', borderRadius: 1, mb: 1 }}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <TextField
                          label="Field"
                          value={condition.field}
                          onChange={(e) => updateCondition(condition.id, { field: e.target.value })}
                          size="small"
                          sx={{ minWidth: 120 }}
                        />
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <InputLabel>Operator</InputLabel>
                          <Select
                            value={condition.operator}
                            onChange={(e) => updateCondition(condition.id, { operator: e.target.value as any })}
                            label="Operator"
                          >
                            <MenuItem value="equals">Equals</MenuItem>
                            <MenuItem value="not_equals">Not Equals</MenuItem>
                            <MenuItem value="contains">Contains</MenuItem>
                            <MenuItem value="greater_than">Greater Than</MenuItem>
                            <MenuItem value="less_than">Less Than</MenuItem>
                          </Select>
                        </FormControl>
                        <TextField
                          label="Value"
                          value={condition.value}
                          onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
                          size="small"
                          sx={{ minWidth: 120 }}
                        />
                        <TextField
                          label="Path Label"
                          value={condition.label}
                          onChange={(e) => updateCondition(condition.id, { label: e.target.value })}
                          size="small"
                          sx={{ minWidth: 120 }}
                        />
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => removeCondition(condition.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
          
          <TextField
            label="Default Path Label"
            value={defaultPath}
            onChange={(e) => setDefaultPath(e.target.value)}
            fullWidth
            helperText="Label for the default path when no conditions match"
          />
          
          <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Preview:</strong> {conditions.length} condition{conditions.length !== 1 ? 's' : ''} + 1 default path
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleCancel} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save Configuration
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DecisionSplitNodeConfig
