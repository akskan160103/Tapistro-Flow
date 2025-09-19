'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Box, Paper, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Email, Schedule, AccountTree, Person } from '@mui/icons-material';
import './ResizableNodePalette.css';

interface ResizableNodePaletteProps {
  onDragStart: (event: React.DragEvent, nodeType: string) => void;
  onNodeClick?: (nodeType: string) => void;
  initialWidth?: number;
}

// Define nodeTypes outside component to prevent recreation on every render
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

const ResizableNodePalette: React.FC<ResizableNodePaletteProps> = ({ 
  onDragStart, 
  onNodeClick,
  initialWidth = 250 
}) => {
  const [width, setWidth] = useState(initialWidth);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    console.log('Resize started'); // Debug log
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const newWidth = e.clientX - containerRect.left;
    
    // Constrain width between 200px and 500px
    const constrainedWidth = Math.min(Math.max(newWidth, 200), 500);
    console.log('Resizing to:', constrainedWidth); // Debug log
    setWidth(constrainedWidth);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  return (
    <Paper 
      ref={containerRef}
      className={`resizable-node-palette-container ${width <= 250 ? 'compact' : ''}`}
      sx={{ width: { xs: '100%', md: width } }}
    >
      <div className="resizable-node-palette-content">
        <Typography className="node-palette-title" component="h2">
          Node Palette
        </Typography>
        <Typography className="node-palette-description">
          Drag nodes to the canvas to build your workflow
        </Typography>
        
        <List className="node-palette-list">
          {nodeTypes.map((nodeType) => (
            <ListItem key={nodeType.id} className="node-palette-item" disablePadding>
            <ListItemButton
              draggable
              onDragStart={(e) => onDragStart(e, nodeType.id)}
              onClick={() => onNodeClick?.(nodeType.id)}
              className="node-palette-button"
            >
                <ListItemIcon className="node-palette-icon">
                  {nodeType.icon}
                </ListItemIcon>
                <ListItemText
                  className="node-palette-text"
                  primary={
                    <Typography className="node-palette-primary">
                      {nodeType.label}
                    </Typography>
                  }
                  secondary={
                    <Typography className="node-palette-secondary">
                      {nodeType.description}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </div>
      
      <div 
        className="resizable-node-palette-resize-handle"
        onMouseDown={handleMouseDown}
      />
    </Paper>
  );
};

export default ResizableNodePalette;
