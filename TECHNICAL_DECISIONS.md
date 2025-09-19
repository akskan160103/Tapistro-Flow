# Technical Decisions

## Technology Choices

### Visual Editor: React Flow
**Chosen over Rete.js** - React Flow provides better React integration, built-in drag-and-drop, and excellent performance for node-based editors.

### State Management: Context API  
**Chosen over Redux** - Context API is sufficient for this scope, simpler to maintain, and reduces dependencies.

### Database: Supabase
**Chosen over Firebase** - Supabase's PostgreSQL foundation provides better type safety and SQL familiarity.

### Testing: Jest + React Testing Library
**Industry standard** - Comprehensive testing with 36 unit tests covering critical functionality, edge cases, and error handling.

## Architecture Decisions

- **Modular Components**: Clear separation between WorkflowBuilder, NodePalette, WorkflowManager
- **Centralized Validation**: WorkflowValidator handles circular dependencies and orphaned nodes
- **Real-time Feedback**: Validation runs on every workflow change
- **Type Safety**: Full TypeScript implementation prevents runtime errors

## Testing Strategy

**36 unit tests** covering:
- Database operations (CRUD)
- User authentication flow  
- Workflow validation logic
- Component behavior and edge cases

