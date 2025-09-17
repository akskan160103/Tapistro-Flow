import { Workflow } from './supabase'


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!


// This class is created so that we can abstract database operations i.e. instead of sending request to endpoints, we can call these class methods from the frontend
// All the methods are static and hence can be directly called using class name since only one copy of the method exists with the class
export class DatabaseService {

  // Get all workflows
  static async getWorkflows(): Promise<Workflow[]> {
    const response = await fetch(API_BASE_URL)
    if (!response.ok) {
      throw new Error('Failed to fetch workflows')
    }
    const data = await response.json()
    return data.workflows || []
  }

  // Create a new workflow
  static async createWorkflow(workflow: Omit<Workflow, 'id' | 'created_at' | 'updated_at'>): Promise<Workflow> {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workflow),
    })
    
    if (!response.ok) {
      throw new Error('Failed to create workflow')
    }
    
    const data = await response.json()
    return data.workflow
  }

  // Update an existing workflow
  static async updateWorkflow(id: string, workflow: Omit<Workflow, 'id' | 'created_at' | 'updated_at'>): Promise<Workflow> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workflow),
    })
    
    if (!response.ok) {
      throw new Error('Failed to update workflow')
    }
    
    const data = await response.json()
    return data.workflow
  }

  // Delete a workflow
  static async deleteWorkflow(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      throw new Error('Failed to delete workflow')
    }
  }
}
