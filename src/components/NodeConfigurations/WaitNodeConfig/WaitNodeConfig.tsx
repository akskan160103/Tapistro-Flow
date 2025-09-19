'use client'

import React, { useState, useEffect } from 'react'
import './WaitNodeConfig.css'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography
} from '@mui/material'

interface WaitNodeConfigProps {
  open: boolean
  onClose: () => void
  onSave: (config: WaitNodeData) => void
  onDelete?: () => void
  initialConfig?: WaitNodeData
}

export interface WaitNodeData {
  duration: number
  timeUnit: 'seconds' | 'minutes' | 'hours' | 'days'
}

const WaitNodeConfig: React.FC<WaitNodeConfigProps> = ({
  open,
  onClose,
  onSave,
  onDelete,
  initialConfig
}) => {
  const [duration, setDuration] = useState<number>(1)
  const [timeUnit, setTimeUnit] = useState<'seconds' | 'minutes' | 'hours' | 'days'>('minutes')

  // Load initial configuration when dialog opens
  useEffect(() => {
    if (open && initialConfig) {
      setDuration(initialConfig.duration)
      setTimeUnit(initialConfig.timeUnit)
    } else if (open) {
      // Reset to defaults when creating new node
      setDuration(1)
      setTimeUnit('minutes')
    }
  }, [open, initialConfig])

  const handleSave = () => {
    const config: WaitNodeData = {
      duration,
      timeUnit
    }
    onSave(config)
    onClose()
  }

  const handleCancel = () => {
    onClose()
  }

  // Helper function to pluralize time units for preview
  const pluralizeTimeUnit = (duration: number, timeUnit: string) => {
    if (duration === 1) {
      return timeUnit.slice(0, -1); // Remove 's' from end
    }
    return timeUnit;
  }

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" component="div">
          Configure Wait Node
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box className="wait-node-config-content">
          <TextField
            label="Duration"
            type="text"
            value={duration}
            onChange={(e) => {
              const value = e.target.value
              // Only allow positive integers
              if (value === '' || /^\d+$/.test(value)) {
                setDuration(value === '' ? 1 : Number(value))
              }
            }}
            fullWidth
            helperText="Enter the wait duration"
          />
          
          <FormControl fullWidth>
            <InputLabel>Time Unit</InputLabel>
            <Select
              value={timeUnit}
              onChange={(e) => setTimeUnit(e.target.value as 'seconds' | 'minutes' | 'hours' | 'days')}
              label="Time Unit"
            >
              <MenuItem value="seconds">Seconds</MenuItem>
              <MenuItem value="minutes">Minutes</MenuItem>
              <MenuItem value="hours">Hours</MenuItem>
              <MenuItem value="days">Days</MenuItem>
            </Select>
          </FormControl>
          
          <Box className="wait-node-config-preview">
            <Typography className="wait-node-config-preview-text">
              <strong>Preview:</strong> Wait for {duration} {pluralizeTimeUnit(duration, timeUnit)}
            </Typography>
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

export default WaitNodeConfig
