import { Workflow } from './supabase'


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!


// This class is created so that we can abstract database operations i.e. instead of sending request to endpoints, we can call these class methods from the frontend
// All the methods are static and hence can be directly called using class name since only one copy of the method exists with the class
export class DatabaseService {

  // Get all workflows for a specific user

  // Mentioning the return type to be more cautious and ensure that the return value is an array of Workflow objects
  static async getWorkflows(username: string): Promise<Workflow[]> {
    const response = await fetch(`${API_BASE_URL}?username=${encodeURIComponent(username)}`)
    if (!response.ok) {
      throw new Error('Failed to fetch workflows')
    }
    const data = await response.json()
    // data.workflows is an array of JSON objects (not Workflow class instances)
    // TypeScript treats them as Workflow[] because the JSON objects have the same property names
    // Hence, TS allows us to return an array of JSON objects (not Workflow objects)
    // In the frontend, you can use the . notation to access properties of JSON objects just like member variables, making them practically indistinguishable from Workflow objects.
    return data.workflows || [] 
  }

  // Create a new workflow
  static async createWorkflow(workflow: Omit<Workflow, 'id' | 'created_at' | 'updated_at'> & { username: string }): Promise<Workflow> {
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
  static async updateWorkflow(id: string, workflow: Omit<Workflow, 'id' | 'created_at' | 'updated_at'> & { username: string }): Promise<Workflow> {
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
  static async deleteWorkflow(id: string, username: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${id}?username=${encodeURIComponent(username)}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      throw new Error('Failed to delete workflow')
    }
  }
}
