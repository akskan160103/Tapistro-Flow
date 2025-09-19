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

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Add your Supabase credentials to `.env.local`

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

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

## Technical Decisions

See [TECHNICAL_DECISIONS.md](./TECHNICAL_DECISIONS.md) for detailed information about:
- Technology stack choices
- Architecture decisions
- Testing strategy
- Performance considerations

## Development

### Code Quality
- **TypeScript**: Full type safety
- **ESLint**: Code linting and formatting
- **Testing**: Comprehensive unit test coverage
- **Error Handling**: Robust error boundaries

### Contributing
1. Follow the existing code patterns
2. Add tests for new functionality
3. Ensure all tests pass
4. Follow TypeScript best practices

## License

This project is part of a technical assessment for Tapistro.
