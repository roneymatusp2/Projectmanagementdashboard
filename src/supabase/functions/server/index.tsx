import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use("*", cors());
app.use("*", logger(console.log));

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Health check
app.get("/make-server-9c55f89c/health", (c) => {
  return c.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Initialize database schema
app.post("/make-server-9c55f89c/init-database", async (c) => {
  try {
    // Check if projects table already exists
    const existingProjects = await kv.get("schema_initialized");
    
    if (existingProjects) {
      return c.json({ 
        message: "Database already initialized",
        initialized: true 
      });
    }

    // Initialize with 9 St Paul's School projects
    const initialProjects = [
      {
        projectCode: "PRJ-001",
        projectName: "Paulean AI v2.0",
        clientName: "Mathematics Department",
        description: "Advanced AI-powered mathematics tutoring system with personalized learning paths",
        currentPhase: "Development",
        completionPercentage: 80.00,
        hoursAllocated: 320.00,
        hoursConsumed: 256.00,
        startDate: "2025-01-15",
        targetCompletionDate: "2025-11-30",
        priority: "High",
        ragStatus: "Green"
      },
      {
        projectCode: "PRJ-002",
        projectName: "Advanced Grades & Assessment System",
        clientName: "Academic Administration",
        description: "Comprehensive grading and assessment platform with analytics dashboard",
        currentPhase: "Development",
        completionPercentage: 65.00,
        hoursAllocated: 280.00,
        hoursConsumed: 182.00,
        startDate: "2025-02-01",
        targetCompletionDate: "2025-12-15",
        priority: "Critical",
        ragStatus: "Amber"
      },
      {
        projectCode: "PRJ-003",
        projectName: "Form Three Portal",
        clientName: "Lower School",
        description: "Dedicated student portal for Form Three with learning resources and communication tools",
        currentPhase: "Development",
        completionPercentage: 55.00,
        hoursAllocated: 200.00,
        hoursConsumed: 110.00,
        startDate: "2025-02-15",
        targetCompletionDate: "2025-11-20",
        priority: "Medium",
        ragStatus: "Green"
      },
      {
        projectCode: "PRJ-004",
        projectName: "Careers Guidance Platform",
        clientName: "Student Services",
        description: "Interactive platform for university guidance, career exploration, and alumni connections",
        currentPhase: "Development",
        completionPercentage: 70.00,
        hoursAllocated: 240.00,
        hoursConsumed: 168.00,
        startDate: "2025-01-20",
        targetCompletionDate: "2025-10-31",
        priority: "High",
        ragStatus: "Green"
      },
      {
        projectCode: "PRJ-005",
        projectName: "Feedback & Lesson Observations v2",
        clientName: "Teaching & Learning",
        description: "Enhanced system for lesson observations, peer feedback, and continuous professional development",
        currentPhase: "Planning",
        completionPercentage: 25.00,
        hoursAllocated: 180.00,
        hoursConsumed: 45.00,
        startDate: "2025-03-01",
        targetCompletionDate: "2025-12-30",
        priority: "Medium",
        ragStatus: "Green"
      },
      {
        projectCode: "PRJ-006",
        projectName: "IB Mathematics Resources Hub",
        clientName: "IB Programme",
        description: "Centralized repository of IB Mathematics resources, past papers, and practice materials",
        currentPhase: "Design",
        completionPercentage: 30.00,
        hoursAllocated: 150.00,
        hoursConsumed: 45.00,
        startDate: "2025-03-10",
        targetCompletionDate: "2026-01-15",
        priority: "Medium",
        ragStatus: "Green"
      },
      {
        projectCode: "PRJ-007",
        projectName: "Institutional Learning Management",
        clientName: "Whole School",
        description: "Enterprise-wide LMS integrating all educational technology systems",
        currentPhase: "Planning",
        completionPercentage: 20.00,
        hoursAllocated: 500.00,
        hoursConsumed: 100.00,
        startDate: "2025-03-15",
        targetCompletionDate: "2026-03-31",
        priority: "Critical",
        ragStatus: "Amber"
      },
      {
        projectCode: "PRJ-008",
        projectName: "Educational Tools Suite",
        clientName: "Faculty Development",
        description: "Curated suite of educational technology tools for teacher professional development",
        currentPhase: "Planning",
        completionPercentage: 15.00,
        hoursAllocated: 120.00,
        hoursConsumed: 18.00,
        startDate: "2025-04-01",
        targetCompletionDate: "2025-12-20",
        priority: "Low",
        ragStatus: "Green"
      },
      {
        projectCode: "PRJ-009",
        projectName: "School News & Communications",
        clientName: "Marketing & Comms",
        description: "Modern communications platform for school news, events, and community engagement",
        currentPhase: "Development",
        completionPercentage: 60.00,
        hoursAllocated: 160.00,
        hoursConsumed: 96.00,
        startDate: "2025-02-20",
        targetCompletionDate: "2025-11-10",
        priority: "High",
        ragStatus: "Green"
      }
    ];

    // Store projects in KV store
    const projectPromises = initialProjects.map((project, index) => 
      kv.set(`project:${project.projectCode}`, project)
    );
    await Promise.all(projectPromises);

    // Mark schema as initialized
    await kv.set("schema_initialized", true);

    return c.json({ 
      message: "Database initialized successfully with 9 projects",
      projectCount: initialProjects.length 
    });
  } catch (error) {
    console.error("Database initialization error:", error);
    return c.json({ error: "Failed to initialize database", details: String(error) }, 500);
  }
});

// Get all projects
app.get("/make-server-9c55f89c/projects", async (c) => {
  try {
    const projects = await kv.getByPrefix("project:");
    return c.json({ projects, count: projects.length });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return c.json({ error: "Failed to fetch projects", details: String(error) }, 500);
  }
});

// Get single project
app.get("/make-server-9c55f89c/projects/:code", async (c) => {
  try {
    const code = c.req.param("code");
    const project = await kv.get(`project:${code}`);
    
    if (!project) {
      return c.json({ error: "Project not found" }, 404);
    }
    
    return c.json({ project });
  } catch (error) {
    console.error("Error fetching project:", error);
    return c.json({ error: "Failed to fetch project", details: String(error) }, 500);
  }
});

// Update project
app.put("/make-server-9c55f89c/projects/:code", async (c) => {
  try {
    const code = c.req.param("code");
    const updates = await c.req.json();
    
    const existingProject = await kv.get(`project:${code}`);
    if (!existingProject) {
      return c.json({ error: "Project not found" }, 404);
    }
    
    const updatedProject = { ...existingProject, ...updates };
    await kv.set(`project:${code}`, updatedProject);
    
    return c.json({ 
      message: "Project updated successfully",
      project: updatedProject 
    });
  } catch (error) {
    console.error("Error updating project:", error);
    return c.json({ error: "Failed to update project", details: String(error) }, 500);
  }
});

// SharePoint requests endpoints
app.get("/make-server-9c55f89c/sharepoint-requests", async (c) => {
  try {
    const requests = await kv.getByPrefix("sharepoint_request:");
    return c.json({ requests, count: requests.length });
  } catch (error) {
    console.error("Error fetching SharePoint requests:", error);
    return c.json({ error: "Failed to fetch requests", details: String(error) }, 500);
  }
});

app.post("/make-server-9c55f89c/sharepoint-requests", async (c) => {
  try {
    const requestData = await c.req.json();
    
    // Generate unique request ID
    const year = new Date().getFullYear();
    const existingRequests = await kv.getByPrefix("sharepoint_request:");
    const requestNumber = String(existingRequests.length + 1).padStart(4, '0');
    const requestId = `SPS-${year}-${requestNumber}`;
    
    const newRequest = {
      ...requestData,
      requestId,
      currentStatus: "Submitted",
      requestedDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };
    
    await kv.set(`sharepoint_request:${requestId}`, newRequest);
    
    return c.json({ 
      message: "SharePoint request submitted successfully",
      request: newRequest 
    }, 201);
  } catch (error) {
    console.error("Error creating SharePoint request:", error);
    return c.json({ error: "Failed to create request", details: String(error) }, 500);
  }
});

app.put("/make-server-9c55f89c/sharepoint-requests/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updates = await c.req.json();
    
    const existingRequest = await kv.get(`sharepoint_request:${id}`);
    if (!existingRequest) {
      return c.json({ error: "Request not found" }, 404);
    }
    
    const updatedRequest = { 
      ...existingRequest, 
      ...updates,
      updatedAt: new Date().toISOString()
    };
    await kv.set(`sharepoint_request:${id}`, updatedRequest);
    
    return c.json({ 
      message: "SharePoint request updated successfully",
      request: updatedRequest 
    });
  } catch (error) {
    console.error("Error updating SharePoint request:", error);
    return c.json({ error: "Failed to update request", details: String(error) }, 500);
  }
});

// Analytics endpoint
app.get("/make-server-9c55f89c/analytics", async (c) => {
  try {
    const projects = await kv.getByPrefix("project:");
    
    const totalProjects = projects.length;
    const totalHoursAllocated = projects.reduce((sum, p) => sum + p.hoursAllocated, 0);
    const totalHoursConsumed = projects.reduce((sum, p) => sum + p.hoursConsumed, 0);
    const avgCompletion = projects.reduce((sum, p) => sum + p.completionPercentage, 0) / totalProjects;
    
    const projectsOnTrack = projects.filter(p => p.ragStatus === "Green").length;
    const projectsAtRisk = projects.filter(p => p.ragStatus === "Amber").length;
    const projectsOverdue = projects.filter(p => p.ragStatus === "Red").length;
    
    return c.json({
      totalProjects,
      totalHoursAllocated: Number(totalHoursAllocated.toFixed(2)),
      totalHoursConsumed: Number(totalHoursConsumed.toFixed(2)),
      totalHoursRemaining: Number((totalHoursAllocated - totalHoursConsumed).toFixed(2)),
      avgCompletion: Number(avgCompletion.toFixed(2)),
      projectsOnTrack,
      projectsAtRisk,
      projectsOverdue,
      efficiencyRatio: Number(((totalHoursAllocated / totalHoursConsumed) * 100).toFixed(2))
    });
  } catch (error) {
    console.error("Error calculating analytics:", error);
    return c.json({ error: "Failed to calculate analytics", details: String(error) }, 500);
  }
});

Deno.serve(app.fetch);
