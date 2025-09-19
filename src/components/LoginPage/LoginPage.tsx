'use client'

import React, { useState } from 'react'
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Container,
  Alert
} from '@mui/material'
import { useUser } from '@/contexts/UserContext'

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const { login } = useUser()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username.trim()) {
      setError('Please enter a username')
      return
    }

    if (username.trim().length < 2) {
      setError('Username must be at least 2 characters')
      return
    }

    // Login the user
    login(username.trim())
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 400
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Tapistro Flow
          </Typography>
          
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Enter your username to start building workflows
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              variant="outlined"
              sx={{ mb: 3 }}
              autoFocus
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
            >
              Start Building
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  )
}

export default LoginPage
