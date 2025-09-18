'use client'

import React, { useState, useEffect } from 'react'
import './SendEmailNodeConfig.css'
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
  Chip
} from '@mui/material'

interface SendEmailNodeConfigProps {
  open: boolean
  onClose: () => void
  onSave: (config: SendEmailNodeData) => void
  initialConfig?: SendEmailNodeData
}

export interface SendEmailNodeData {
  subject: string
  template: string
  recipients: string[]
  recipientType: 'all' | 'specific' | 'segment'
}

const SendEmailNodeConfig: React.FC<SendEmailNodeConfigProps> = ({
  open,
  onClose,
  onSave,
  initialConfig
}) => {
  const [subject, setSubject] = useState<string>('')
  const [template, setTemplate] = useState<string>('')
  const [recipients, setRecipients] = useState<string[]>([])
  const [recipientType, setRecipientType] = useState<'all' | 'specific' | 'segment'>('all')
  const [newRecipient, setNewRecipient] = useState<string>('')
  const [subjectError, setSubjectError] = useState<string>('')

  // Load initial configuration when dialog opens
  useEffect(() => {
    if (open && initialConfig) {
      setSubject(initialConfig.subject)
      setTemplate(initialConfig.template)
      setRecipients(initialConfig.recipients)
      setRecipientType(initialConfig.recipientType)
    } else if (open) {
      // Reset to defaults when creating new node
      setSubject('')
      setTemplate('')
      setRecipients([])
      setRecipientType('all')
    }
  }, [open, initialConfig])

  const handleAddRecipient = () => {
    if (newRecipient.trim() && !recipients.includes(newRecipient.trim())) {
      setRecipients([...recipients, newRecipient.trim()])
      setNewRecipient('')
    }
  }

  const handleRemoveRecipient = (recipient: string) => {
    setRecipients(recipients.filter(r => r !== recipient))
  }

  const handleSave = () => {
    // Clear previous errors
    setSubjectError('')
    
    // Validate required fields
    if (!subject.trim()) {
      setSubjectError('Please enter an email subject')
      return
    }

    const config: SendEmailNodeData = {
      subject: subject.trim(),
      template,
      recipients,
      recipientType
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
          Configure Send Email Node
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box className="send-email-config-content">
          <TextField
            label="Email Subject"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value)
              // Clear error when user starts typing
              if (subjectError) {
                setSubjectError('')
              }
            }}
            fullWidth
            required
            error={!!subjectError}
            helperText={subjectError || "Enter the email subject line"}
          />
          
          <TextField
            label="Email Template"
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            multiline
            rows={4}
            fullWidth
            helperText="Enter the email content template"
          />
          
          <FormControl fullWidth>
            <InputLabel>Recipient Type</InputLabel>
            <Select
              value={recipientType}
              onChange={(e) => setRecipientType(e.target.value as 'all' | 'specific' | 'segment')}
              label="Recipient Type"
            >
              <MenuItem value="all">All Users</MenuItem>
              <MenuItem value="specific">Specific Recipients</MenuItem>
              <MenuItem value="segment">User Segment</MenuItem>
            </Select>
          </FormControl>
          
          {recipientType === 'specific' && (
            <Box className="recipient-section">
              <Box className="recipient-input-container">
                <TextField
                  label="Add Recipient Email"
                  value={newRecipient}
                  onChange={(e) => setNewRecipient(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddRecipient()}
                  fullWidth
                />
                <Button 
                  variant="outlined" 
                  onClick={handleAddRecipient}
                  disabled={!newRecipient.trim()}
                >
                  Add
                </Button>
              </Box>
              
              <Box className="recipient-chips">
                {recipients.map((recipient, index) => (
                  <Chip
                    key={index}
                    label={recipient}
                    onDelete={() => handleRemoveRecipient(recipient)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}
          
          <Box className="send-email-config-preview">
            <Typography className="send-email-config-preview-text">
              <strong>Preview:</strong> Send email "{subject}" to {recipientType === 'all' ? 'all users' : `${recipients.length} recipients`}
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

export default SendEmailNodeConfig
