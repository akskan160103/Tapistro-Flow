import { WorkflowValidator } from '../src/lib/workflowValidation'

describe('WorkflowValidator', () => {
  describe('validateWorkflow', () => {
    it('should return valid for empty workflow', () => {
      const result = WorkflowValidator.validateWorkflow([], [])
      
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
      expect(result.warnings).toHaveLength(0)
    })

    it('should return valid for single node workflow', () => {
      const nodes = [{ id: 'node1', type: 'default', data: { label: 'Test' } }]
      const edges: any[] = []
      
      const result = WorkflowValidator.validateWorkflow(nodes, edges)
      
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
      expect(result.warnings).toHaveLength(0)
    })

    it('should return valid for connected workflow', () => {
      const nodes = [
        { id: 'node1', type: 'default', data: { label: 'Start' } },
        { id: 'node2', type: 'default', data: { label: 'End' } }
      ]
      const edges = [{ id: 'edge1', source: 'node1', target: 'node2' }]
      
      const result = WorkflowValidator.validateWorkflow(nodes, edges)
      
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
      expect(result.warnings).toHaveLength(0)
    })

    it('should detect orphaned nodes', () => {
      const nodes = [
        { id: 'node1', type: 'default', data: { label: 'Connected' } },
        { id: 'node2', type: 'default', data: { label: 'Orphaned' } },
        { id: 'node3', type: 'default', data: { label: 'Connected2' } }
      ]
      const edges = [{ id: 'edge1', source: 'node1', target: 'node3' }]
      
      const result = WorkflowValidator.validateWorkflow(nodes, edges)
      
      expect(result.isValid).toBe(true) // Orphaned nodes are warnings, not errors
      expect(result.warnings).toHaveLength(1)
      expect(result.warnings[0].message).toContain('orphaned node')
    })

    it('should detect circular dependencies', () => {
      const nodes = [
        { id: 'node1', type: 'default', data: { label: 'Node 1' } },
        { id: 'node2', type: 'default', data: { label: 'Node 2' } }
      ]
      const edges = [
        { id: 'edge1', source: 'node1', target: 'node2' },
        { id: 'edge2', source: 'node2', target: 'node1' }
      ]
      
      const result = WorkflowValidator.validateWorkflow(nodes, edges)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0].message).toContain('Circular dependency')
    })

    it('should detect complex circular dependencies', () => {
      const nodes = [
        { id: 'node1', type: 'default', data: { label: 'Node 1' } },
        { id: 'node2', type: 'default', data: { label: 'Node 2' } },
        { id: 'node3', type: 'default', data: { label: 'Node 3' } }
      ]
      const edges = [
        { id: 'edge1', source: 'node1', target: 'node2' },
        { id: 'edge2', source: 'node2', target: 'node3' },
        { id: 'edge3', source: 'node3', target: 'node1' }
      ]
      
      const result = WorkflowValidator.validateWorkflow(nodes, edges)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0].message).toContain('Circular dependency')
    })

    it('should handle multiple orphaned nodes', () => {
      const nodes = [
        { id: 'node1', type: 'default', data: { label: 'Connected' } },
        { id: 'node2', type: 'default', data: { label: 'Orphaned 1' } },
        { id: 'node3', type: 'default', data: { label: 'Orphaned 2' } }
      ]
      const edges: any[] = []
      
      const result = WorkflowValidator.validateWorkflow(nodes, edges)
      
      expect(result.isValid).toBe(true)
      expect(result.warnings).toHaveLength(1)
      expect(result.warnings[0].message).toContain('3 orphaned node')
    })

    it('should handle both errors and warnings', () => {
      const nodes = [
        { id: 'node1', type: 'default', data: { label: 'Node 1' } },
        { id: 'node2', type: 'default', data: { label: 'Node 2' } },
        { id: 'node3', type: 'default', data: { label: 'Orphaned' } }
      ]
      const edges = [
        { id: 'edge1', source: 'node1', target: 'node2' },
        { id: 'edge2', source: 'node2', target: 'node1' }
      ]
      
      const result = WorkflowValidator.validateWorkflow(nodes, edges)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(1)
      expect(result.warnings).toHaveLength(1)
    })
  })
})
