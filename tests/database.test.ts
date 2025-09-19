import { DatabaseService } from '../src/lib/database'

// Mock fetch globally
global.fetch = jest.fn()

describe('DatabaseService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getWorkflows', () => {
    it('should fetch workflows successfully', async () => {
      const mockWorkflows = [
        { id: '1', name: 'Workflow 1', nodes: [], edges: [], username: 'user1', created_at: '2024-01-01', updated_at: '2024-01-01' },
        { id: '2', name: 'Workflow 2', nodes: [], edges: [], username: 'user1', created_at: '2024-01-02', updated_at: '2024-01-02' }
      ]

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ workflows: mockWorkflows })
      })

      const result = await DatabaseService.getWorkflows('user1')

      expect(fetch).toHaveBeenCalledWith('/api/workflows?username=user1')
      expect(result).toEqual(mockWorkflows)
    })

    it('should handle fetch errors', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500
      })

      await expect(DatabaseService.getWorkflows('user1')).rejects.toThrow('Failed to fetch workflows')
    })

    it('should return empty array when no workflows', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ workflows: [] })
      })

      const result = await DatabaseService.getWorkflows('user1')

      expect(result).toEqual([])
    })
  })

  describe('createWorkflow', () => {
    it('should create workflow successfully', async () => {
      const mockWorkflow = {
        id: '1',
        name: 'New Workflow',
        nodes: [],
        edges: [],
        username: 'user1',
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ workflow: mockWorkflow })
      })

      const workflowData = {
        name: 'New Workflow',
        nodes: [],
        edges: [],
        username: 'user1'
      }

      const result = await DatabaseService.createWorkflow(workflowData)

      expect(fetch).toHaveBeenCalledWith('/api/workflows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workflowData),
      })
      expect(result).toEqual(mockWorkflow)
    })

    it('should handle creation errors', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400
      })

      const workflowData = {
        name: 'New Workflow',
        nodes: [],
        edges: [],
        username: 'user1'
      }

      await expect(DatabaseService.createWorkflow(workflowData)).rejects.toThrow('Failed to create workflow')
    })
  })

  describe('updateWorkflow', () => {
    it('should update workflow successfully', async () => {
      const mockWorkflow = {
        id: '1',
        name: 'Updated Workflow',
        nodes: [],
        edges: [],
        username: 'user1',
        created_at: '2024-01-01',
        updated_at: '2024-01-02'
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ workflow: mockWorkflow })
      })

      const updateData = {
        name: 'Updated Workflow',
        nodes: [],
        edges: [],
        username: 'user1'
      }

      const result = await DatabaseService.updateWorkflow('1', updateData)

      expect(fetch).toHaveBeenCalledWith('/api/workflows/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })
      expect(result).toEqual(mockWorkflow)
    })

    it('should handle update errors', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404
      })

      const updateData = {
        name: 'Updated Workflow',
        nodes: [],
        edges: [],
        username: 'user1'
      }

      await expect(DatabaseService.updateWorkflow('1', updateData)).rejects.toThrow('Failed to update workflow')
    })
  })

  describe('deleteWorkflow', () => {
    it('should delete workflow successfully', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true
      })

      await DatabaseService.deleteWorkflow('1', 'user1')

      expect(fetch).toHaveBeenCalledWith('/api/workflows/1?username=user1', {
        method: 'DELETE',
      })
    })

    it('should handle deletion errors', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404
      })

      await expect(DatabaseService.deleteWorkflow('1', 'user1')).rejects.toThrow('Failed to delete workflow')
    })
  })

  describe('deleteAllWorkflows', () => {
    it('should delete all workflows successfully', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true
      })

      await DatabaseService.deleteAllWorkflows('user1')

      expect(fetch).toHaveBeenCalledWith('/api/workflows?username=user1', {
        method: 'DELETE',
      })
    })

    it('should handle deletion errors', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500
      })

      await expect(DatabaseService.deleteAllWorkflows('user1')).rejects.toThrow('Failed to delete all workflows')
    })
  })
})
