'use client';

import React from 'react';
import { Box, Paper, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Email, Schedule, AccountTree, Person } from '@mui/icons-material';

interface NodePaletteProps {
  onDragStart: (event: React.DragEvent, nodeType: string) => void;
}

const nodeTypes = [
  {
    id: 'send-email',
    label: 'Send Email',
    icon: <Email />,
    description: 'Send email campaigns with templates and recipients'
  },
  {
    id: 'wait',
    label: 'Wait',
    icon: <Schedule />,
    description: 'Add delays with configurable duration'
  },
  {
    id: 'decision-split',
    label: 'Decision Split',
    icon: <AccountTree />,
    description: 'Create conditional branches based on user properties'
  },
  {
    id: 'update-profile',
    label: 'Update Profile',
    icon: <Person />,
    description: 'Modify user profile data with field updates'
  }
];

const NodePalette: React.FC<NodePaletteProps> = ({ onDragStart }) => {
  return (
    <Paper sx={{ width: 250, height: '100%', p: 2 }}>
      <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
        Node Palette
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Drag nodes to the canvas to build your workflow
      </Typography>
      
      <List>
        {nodeTypes.map((nodeType) => (
          <ListItem key={nodeType.id} disablePadding>
            <ListItemButton
              draggable
              onDragStart={(e) => onDragStart(e, nodeType.id)}
              sx={{
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                mb: 1,
                cursor: 'grab',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                  borderColor: '#1976d2'
                },
                '&:active': {
                  cursor: 'grabbing'
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {nodeType.icon}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography fontWeight="medium">
                    {nodeType.label}
                  </Typography>
                }
                secondary={
                  <Typography fontSize="0.75rem">
                    {nodeType.description}
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default NodePalette;
