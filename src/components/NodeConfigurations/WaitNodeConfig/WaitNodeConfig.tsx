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
  hours: number
  minutes: number
  seconds: number
}

const WaitNodeConfig: React.FC<WaitNodeConfigProps> = ({
  open,
  onClose,
  onSave,
  onDelete,
  initialConfig
}) => {
  const [hours, setHours] = useState<string>('0')
  const [minutes, setMinutes] = useState<string>('1')
  const [seconds, setSeconds] = useState<string>('0')
  const [validationError, setValidationError] = useState<string>('')

  // Load initial configuration when dialog opens
  useEffect(() => {
    if (open && initialConfig) {
      setHours(initialConfig.hours.toString())
      setMinutes(initialConfig.minutes.toString())
      setSeconds(initialConfig.seconds.toString())
    } else if (open) {
      // Reset to defaults when creating new node
      setHours('0')
      setMinutes('1')
      setSeconds('0')
    }
  }, [open, initialConfig])

  const handleSave = () => {
    // Convert strings to numbers and validate
    const hoursNum = parseInt(hours) || 0
    const minutesNum = parseInt(minutes) || 0
    const secondsNum = parseInt(seconds) || 0
    
    // At least one field must have a value > 0
    if (hoursNum === 0 && minutesNum === 0 && secondsNum === 0) {
      setValidationError('Please enter at least one time value (hours, minutes, or seconds)')
      return // Don't save if all are zero
    }
    
    // Validate individual values
    if (hoursNum < 0 || minutesNum < 0 || secondsNum < 0) {
      setValidationError('Time values cannot be negative')
      return
    }
    
    if (minutesNum >= 60 || secondsNum >= 60) {
      setValidationError('Minutes and seconds must be less than 60')
      return
    }
    
    const config: WaitNodeData = {
      hours: hoursNum,
      minutes: minutesNum,
      seconds: secondsNum
    }
    onSave(config)
    onClose()
  }

  const handleCancel = () => {
    onClose()
  }

  // Helper function to format time display
  const formatTimeDisplay = (h: string, m: string, s: string) => {
    const hoursNum = parseInt(h) || 0
    const minutesNum = parseInt(m) || 0
    const secondsNum = parseInt(s) || 0
    
    const parts = []
    if (hoursNum > 0) parts.push(`${hoursNum}h`)
    if (minutesNum > 0) parts.push(`${minutesNum}m`)
    if (secondsNum > 0) parts.push(`${secondsNum}s`)
    
    return parts.length > 0 ? parts.join(' ') : '0m'
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
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Hours"
              type="text"
              value={hours}
              onChange={(e) => {
                const value = e.target.value
                if (value === '' || /^\d+$/.test(value)) {
                  setHours(value)
                  setValidationError('')
                }
              }}
              sx={{ flex: 1 }}
              error={!!validationError}
            />
            <TextField
              label="Minutes"
              type="text"
              value={minutes}
              onChange={(e) => {
                const value = e.target.value
                if (value === '' || /^\d+$/.test(value)) {
                  setMinutes(value)
                  setValidationError('')
                }
              }}
              sx={{ flex: 1 }}
              error={!!validationError}
            />
            <TextField
              label="Seconds"
              type="text"
              value={seconds}
              onChange={(e) => {
                const value = e.target.value
                if (value === '' || /^\d+$/.test(value)) {
                  setSeconds(value)
                  setValidationError('')
                }
              }}
              sx={{ flex: 1 }}
              error={!!validationError}
            />
          </Box>
          
          {validationError && (
            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
              {validationError}
            </Typography>
          )}
          
          <Box className="wait-node-config-preview">
            <Typography className="wait-node-config-preview-text">
              <strong>Preview:</strong> Wait for {formatTimeDisplay(hours, minutes, seconds)}
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
