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
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material'

interface UpdateProfileNodeConfigProps {
  open: boolean
  onClose: () => void
  onSave: (config: UpdateProfileNodeData) => void
  initialConfig?: UpdateProfileNodeData
}

export interface UpdateProfileNodeData {
  updates: Array<{
    id: string
    field: string
    value: string
    operation: 'set' | 'increment' | 'append' | 'prepend'
  }>
}

const UpdateProfileNodeConfig: React.FC<UpdateProfileNodeConfigProps> = ({
  open,
  onClose,
  onSave,
  initialConfig
}) => {
  const [updates, setUpdates] = useState<Array<{
    id: string
    field: string
    value: string
    operation: 'set' | 'increment' | 'append' | 'prepend'
  }>>([])

  // Load initial configuration when dialog opens
  useEffect(() => {
    if (open && initialConfig) {
      setUpdates(initialConfig.updates)
    } else if (open) {
      // Reset to defaults when creating new node
      setUpdates([])
    }
  }, [open, initialConfig])

  const addUpdate = () => {
    const newUpdate = {
      id: `update-${Date.now()}`,
      field: '',
      value: '',
      operation: 'set' as const
    }
    setUpdates([...updates, newUpdate])
  }

  const updateField = (id: string, updates: Partial<typeof updates[0]>) => {
    setUpdates(updates.map(update => 
      update.id === id ? { ...update, ...updates } : update
    ))
  }

  const removeUpdate = (id: string) => {
    setUpdates(updates.filter(update => update.id !== id))
  }

  const handleSave = () => {
    const config: UpdateProfileNodeData = {
      updates
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
          Configure Update Profile Node
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Profile Updates</Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addUpdate}
            >
              Add Update
            </Button>
          </Box>
          
          {updates.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                No profile updates defined. Click "Add Update" to configure profile changes.
              </Typography>
            </Box>
          ) : (
            <List>
              {updates.map((update, index) => (
                <ListItem key={update.id} sx={{ border: 1, borderColor: 'grey.300', borderRadius: 1, mb: 1 }}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <TextField
                          label="Field Name"
                          value={update.field}
                          onChange={(e) => updateField(update.id, { field: e.target.value })}
                          size="small"
                          sx={{ minWidth: 150 }}
                          placeholder="e.g., name, email, age"
                        />
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <InputLabel>Operation</InputLabel>
                          <Select
                            value={update.operation}
                            onChange={(e) => updateField(update.id, { operation: e.target.value as any })}
                            label="Operation"
                          >
                            <MenuItem value="set">Set</MenuItem>
                            <MenuItem value="increment">Increment</MenuItem>
                            <MenuItem value="append">Append</MenuItem>
                            <MenuItem value="prepend">Prepend</MenuItem>
                          </Select>
                        </FormControl>
                        <TextField
                          label="Value"
                          value={update.value}
                          onChange={(e) => updateField(update.id, { value: e.target.value })}
                          size="small"
                          sx={{ minWidth: 150 }}
                          placeholder="New value"
                        />
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => removeUpdate(update.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
          
          <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Preview:</strong> {updates.length} profile update{updates.length !== 1 ? 's' : ''} configured
            </Typography>
            {updates.length > 0 && (
              <Box sx={{ mt: 1 }}>
                {updates.map((update, index) => (
                  <Typography key={index} variant="caption" display="block">
                    • {update.field} → {update.operation} "{update.value}"
                  </Typography>
                ))}
              </Box>
            )}
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

export default UpdateProfileNodeConfig
