'use client'

import React, { useState, useEffect } from 'react'
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

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" component="div">
          Configure Wait Node
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
          <TextField
            label="Duration"
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            inputProps={{ min: 1 }}
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
          
          <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Preview:</strong> Wait for {duration} {timeUnit}
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

export default WaitNodeConfig
