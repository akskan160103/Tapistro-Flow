// Workflow validation service
// Handles validation logic for workflows before saving

export interface ValidationError {
  type: 'error' | 'warning'
  message: string
  nodeId?: string
  field?: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationError[]
}

export class WorkflowValidator {
  /**
   * Validates a complete workflow
   */
  static validateWorkflow(nodes: any[], edges: any[]): ValidationResult {
    const errors: ValidationError[] = []
    const warnings: ValidationError[] = []

    // Skip validation for empty workflows (handled by existing save logic)
    if (nodes.length === 0) {
      return { isValid: true, errors: [], warnings: [] }
    }

    // Check for orphaned nodes
    const orphanedNodes = this.findOrphanedNodes(nodes, edges)
    if (orphanedNodes.length > 0) {
      warnings.push({
        type: 'warning',
        message: `Found ${orphanedNodes.length} orphaned node(s). Consider connecting them to the main workflow.`
      })
    }

    // Check for circular dependencies
    const circularDeps = this.findCircularDependencies(nodes, edges)
    if (circularDeps.length > 0) {
      errors.push({
        type: 'error',
        message: 'Circular dependency detected. This will cause infinite loops.'
      })
    }

    // Note: Node configuration validation is handled inline in config dialogs
    // This validation only checks structural workflow issues

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  /**
   * Find nodes that are not connected to the main workflow
   */
  private static findOrphanedNodes(nodes: any[], edges: any[]): string[] {
    if (nodes.length === 0) return []
    if (nodes.length === 1) return [] // Single node is not orphaned

    const connectedNodes = new Set<string>()
    
    // Add all nodes that have connections
    edges.forEach(edge => {
      connectedNodes.add(edge.source)
      connectedNodes.add(edge.target)
    })

    // Find nodes that are not connected
    return nodes
      .filter(node => !connectedNodes.has(node.id))
      .map(node => node.id)
  }

  /**
   * Find circular dependencies using DFS
   */
  private static findCircularDependencies(nodes: any[], edges: any[]): string[] {
    const graph = new Map<string, string[]>()
    const visited = new Set<string>()
    const recursionStack = new Set<string>()

    // Build adjacency list
    nodes.forEach(node => {
      graph.set(node.id, [])
    })
    edges.forEach(edge => {
      const neighbors = graph.get(edge.source) || []
      neighbors.push(edge.target)
      graph.set(edge.source, neighbors)
    })

    // DFS to detect cycles
    const hasCycle = (nodeId: string): boolean => {
      if (recursionStack.has(nodeId)) return true
      if (visited.has(nodeId)) return false

      visited.add(nodeId)
      recursionStack.add(nodeId)

      const neighbors = graph.get(nodeId) || []
      for (const neighbor of neighbors) {
        if (hasCycle(neighbor)) return true
      }

      recursionStack.delete(nodeId)
      return false
    }

    // Check each node for cycles
    for (const node of nodes) {
      if (!visited.has(node.id) && hasCycle(node.id)) {
        return Array.from(recursionStack)
      }
    }

    return []
  }

}
