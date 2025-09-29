import projectsData from '@/services/mockData/projects.json';
import { toast } from 'react-toastify';

// Create a copy to avoid mutating the original data
let projects = [...projectsData];

// Simulate network delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const projectService = {
  // Get all projects
  async getAll() {
    await delay(200);
    return [...projects];
  },

  // Get project by ID
  async getById(id) {
    await delay(150);
    const project = projects.find(p => p.Id === parseInt(id));
    if (!project) {
      throw new Error(`Project with ID ${id} not found`);
    }
    return { ...project };
  },

// Create new project
  async create(projectData) {
    await delay(300);
    const maxId = projects.reduce((max, p) => Math.max(max, p.Id), 0);
    
    const newProject = {
      Id: maxId + 1,
      name: projectData.name,
      description: projectData.description || "",
      status: projectData.status || "planning",
      milestone: projectData.milestone || ""
    };

    projects.push(newProject);
    
    // Create project in Clockify (async, don't block local creation)
    this.createInClockify(newProject).catch(error => {
      console.info(`apper_info: An error was received in this function: ${import.meta.env.VITE_CREATE_CLOCKIFY_PROJECT}. The error is: ${error.message}`);
    });
    
    return { ...newProject };
  },

  // Create project in Clockify
  async createInClockify(projectData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const result = await apperClient.functions.invoke(import.meta.env.VITE_CREATE_CLOCKIFY_PROJECT, {
        body: JSON.stringify({
          projectName: projectData.name,
          projectDescription: projectData.description,
          projectStatus: projectData.status
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const responseData = await result.json();
      
      if (responseData.success) {
        toast.success('Project created in Clockify successfully!');
      } else {
        console.info(`apper_info: An error was received in this function: ${import.meta.env.VITE_CREATE_CLOCKIFY_PROJECT}. The response body is: ${JSON.stringify(responseData)}.`);
        toast.error('Project created locally, but failed to sync with Clockify');
      }
    } catch (error) {
      console.info(`apper_info: An error was received in this function: ${import.meta.env.VITE_CREATE_CLOCKIFY_PROJECT}. The error is: ${error.message}`);
      toast.error('Project created locally, but Clockify sync unavailable');
    }
  },

  // Update existing project
  async update(id, updates) {
    await delay(250);
    const index = projects.findIndex(p => p.Id === parseInt(id));
    
    if (index === -1) {
      throw new Error(`Project with ID ${id} not found`);
    }

    projects[index] = {
      ...projects[index],
      ...updates
    };
    return { ...projects[index] };
  },

  // Delete project
  async delete(id) {
    await delay(200);
    const index = projects.findIndex(p => p.Id === parseInt(id));
    
    if (index === -1) {
      throw new Error(`Project with ID ${id} not found`);
    }

    const deletedProject = projects.splice(index, 1)[0];
    return { ...deletedProject };
  }
};