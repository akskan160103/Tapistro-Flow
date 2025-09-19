'use client'

import React, { useState, useEffect } from 'react'
import './UpdateProfileNodeConfig.css'
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
  onDelete?: () => void
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
  onDelete,
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

  const updateField = (id: string, fieldUpdates: Partial<typeof updates[0]>) => {
    setUpdates(updates.map(update => 
      update.id === id ? { ...update, ...fieldUpdates } : update
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
        <Box className="update-profile-config-content">
          <Box className="updates-header">
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
            <Box className="no-updates-message">
              <Typography variant="body2" color="text.secondary">
                No profile updates defined. Click "Add Update" to configure profile changes.
              </Typography>
            </Box>
          ) : (
            <List className="updates-list">
              {updates.map((update, index) => (
                <ListItem key={update.id} className="update-item">
                  <ListItemText
                    primary={
                      <Box className="update-fields">
                        <TextField
                          label="Field Name"
                          value={update.field}
                          onChange={(e) => updateField(update.id, { field: e.target.value })}
                          size="small"
                          className="update-field-input"
                          placeholder="e.g., name, email, age"
                        />
                        <FormControl size="small" className="update-operation-input">
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
                          className="update-value-input"
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
          
          <Box className="update-profile-config-preview">
            <Typography className="update-profile-config-preview-text">
              <strong>Preview:</strong> {updates.length} profile update{updates.length !== 1 ? 's' : ''} configured
            </Typography>
            {updates.length > 0 && (
              <Box className="update-preview-details">
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
        {onDelete && (
          <Button onClick={onDelete} color="error" variant="outlined">
            Delete Node
          </Button>
        )}
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
