# Visual Workflow Orchestration Builder

A React-based visual workflow builder that allows users to create, configure, and validate customer journey workflows through an intuitive drag-and-drop interface.

## Features

- **Visual Workflow Builder**: Drag-and-drop interface for creating workflows
- **Node Types**: Wait, Send Email, Decision Split, Update Profile nodes
- **Real-time Validation**: Detects circular dependencies and orphaned nodes
- **Workflow Management**: Save, load, and manage multiple workflows
- **User Authentication**: Secure user sessions with Supabase
- **Comprehensive Testing**: 36 unit tests covering all critical functionality

## Technology Stack

- **Frontend**: React 19, Next.js 15, TypeScript
- **UI Framework**: Material-UI (MUI)
- **Visual Editor**: React Flow
- **State Management**: React Context API
- **Database**: Supabase (PostgreSQL)
- **Testing**: Jest + React Testing Library

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (for database)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/akskan160103/Tapistro-Flow.git
   cd Tapistro-Flow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment variables are already configured**
   
   The `.env` file with Supabase credentials is included in the repository for easy setup. No additional configuration needed!

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser

### Quick Start Guide

1. **Login**: Create an account or login with existing credentials
2. **Build Workflow**: Drag nodes from the palette to the canvas
3. **Connect Nodes**: Draw connections between nodes to define flow
4. **Configure Nodes**: Click on nodes to set up their properties
5. **Save Workflow**: Use the "Save Workflow" button to persist your work
6. **Validate**: The system automatically validates for circular dependencies and orphaned nodes

## Testing

Run the comprehensive test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

**Test Coverage:**
- ✅ Database operations (CRUD)
- ✅ User authentication flow
- ✅ Workflow validation logic
- ✅ Component behavior and interactions
- ✅ Edge cases and error handling

## Project Structure

```
src/
├── app/                    # Next.js app router
├── components/            # React components
│   ├── WorkflowBuilder/   # Main workflow builder
│   ├── NodePalette/       # Node selection palette
│   ├── WorkflowManager/   # Save/load workflows
│   └── NodeConfigurations/ # Node config dialogs
├── contexts/              # React contexts
├── lib/                   # Utility libraries
├── types/                 # TypeScript types
└── utils/                 # Helper functions

tests/                     # Test files
├── database.test.ts       # Database tests
├── userContext.test.tsx   # Authentication tests
├── workflowValidation.test.ts # Validation tests
└── waitNodeConfig.test.tsx # Component tests
```

## Key Features

### Workflow Validation
- **Circular Dependency Detection**: Prevents infinite loops
- **Orphaned Node Detection**: Identifies disconnected nodes
- **Real-time Feedback**: Immediate validation as you build

### Node Types
- **Wait Node**: Configurable time delays
- **Send Email Node**: Email campaign configuration
- **Decision Split Node**: Conditional branching logic
- **Update Profile Node**: User profile modifications

### User Experience
- **Drag & Drop**: Intuitive node placement
- **Visual Connections**: Clear workflow flow representation
- **Configuration Dialogs**: Easy node setup
- **Error Prevention**: Validation prevents invalid workflows
- **Desktop Optimized**: Designed for laptop and desktop computers
- **Mobile Warning**: Professional message for mobile users explaining desktop requirement

## Technical Decisions

See [TECHNICAL_DECISIONS.md](./TECHNICAL_DECISIONS.md) for detailed information about:
- Technology stack choices
- Architecture decisions
- Testing strategy
- Performance considerations

### Common Issues

**Environment Variables Not Loading:**
- The `.env` file is included in the repository with pre-configured Supabase credentials
- If you encounter issues, restart the development server

**Mobile/Tablet Issues:**
- Tapistro Flow is optimized for desktop and laptop computers
- Mobile devices will show a professional warning message



## License

This project is part of a technical assessment for Tapistro.
