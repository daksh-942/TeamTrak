import Project from "../models/project.model.js";
import Task from "../models/task.model.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

export async function createTask(req, res) {
  try {
    const {
      title,
      description,
      assignee,
      deadline,
      status,
      priority,
      project,
    } = req.body;

    // Validation
    if (!title || !assignee || !deadline || !status || !priority || !project) {
      throw new ApiError(400, "Missing required fields.");
    }

    const [assignedUser, foundProject] = await Promise.all([
      User.findById(assignee),
      Project.findById(project),
    ]);

    if (!assignedUser || !foundProject) {
      throw new ApiError(404, "Invalid assignee/project/team ID.");
    }

    const task = await Task.create({
      title,
      description,
      assignee,
      deadline: new Date(deadline),
      status,
      priority,
      project,
      createdBy: req.user._id, // From authentication middleware
      activityLogs: [
        {
          message: `Task "${title}" created`,
          createdBy: req.user._id,
        },
      ],
    });

    const newTask = await Task.findById(task._id)
      .populate("assignee", "firstname lastname email")
      .populate("createdBy", "firstname lastname email")
      .populate("project", "name")
      .populate("team", "name")
      .sort({ createdAt: -1 });

    return res.status(201).json({ success: true, task: newTask });
  } catch (error) {
    console.error("Error creating task:", error);

    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
}

export async function getAllTasks(req, res) {
  try {
    const { team, project, assignee, status, priority } = req.query;

    const filter = {};

    // Apply filters if provided
    if (team) filter.team = team;
    if (project) filter.project = project;
    if (assignee) filter.assignee = assignee;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const isEmpty = Object.keys(filter).length === 0;
    if (isEmpty) throw new Error(400, "No filters.");

    const tasks = await Task.find(filter)
      .populate("assignee", "firstname lastname email")
      .populate("createdBy", "firstname lastname email")
      .populate("project", "name")
      .populate("team", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
}

export async function getTaskById(req, res) {
  try {
    const { id: taskId } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid task ID");
    }

    const task = await Task.findById(id)
      .populate("assignee", "name email avatar")
      .populate("createdBy", "name email")
      .populate("project", "name")
      .populate("team", "name")
      .populate("activityLogs.createdBy", "name email");

    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    res.status(200).json({ success: true, task });
  } catch (error) {
    console.error("Error fetching task:", error);
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
}

export async function updateTask(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid task ID");
    }

    const existingTask = await Task.findById(id);
    if (!existingTask) {
      throw new ApiError(404, "Task not found");
    }

    const {
      title,
      description,
      assignee,
      deadline,
      status,
      priority,
      project,
      team,
      logMessage,
      logCreatedBy,
    } = req.body;

    // Update fields if provided
    if (title) existingTask.title = title;
    if (description) existingTask.description = description;
    if (assignee) existingTask.assignee = assignee;
    if (deadline) existingTask.deadline = deadline;
    if (status) existingTask.status = status;
    if (priority) existingTask.priority = priority;
    if (project) existingTask.project = project;
    if (team) existingTask.team = team;

    // Add to activityLogs if needed
    if (logMessage && logCreatedBy) {
      existingTask.activityLogs.push({
        message: logMessage,
        createdBy: logCreatedBy,
      });
    }

    await existingTask.save();

    res.status(200).json({ success: true, task: existingTask });
  } catch (error) {
    console.error("Error updating task:", error);
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
}

export async function deleteTask(req, res) {
  try {
    const { id: taskId } = req.params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid task ID");
    }

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      throw new ApiError(404, "Task not found");
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      task: deletedTask,
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

export async function changeTaskStatus(req, res) {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    if (!taskId) {
      throw new ApiError(400, "Task ID is required");
    }

    if (!status) {
      throw new ApiError(400, "Status is required");
    }

    const validStatuses = ["Not Started", "In Progress", "Completed"];
    if (!validStatuses.includes(status)) {
      throw new ApiError(400, "Invalid status value");
    }

    const task = await Task.findById(taskId);
    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    if (task.status === status)
      throw new ApiError(400, "Cannot update to same status.");

    task.status = status;

    task.activityLogs.push({
      message: `Task status changed to ${status}`,
      createdBy: req.user?._id,
    });

    await task.save();

    return res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      task,
    });
  } catch (error) {
    console.error("Error changing task status:", error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    // For unexpected errors
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function addTaskActivity(req, res) {
  try {
    const { taskId } = req.params;
    const { message, createdBy } = req.body;

    // Validate input
    if (!message || !message.trim()) {
      throw new ApiError(400, "Activity message is required");
    }
    if (!createdBy) {
      throw new ApiError(400, "CreatedBy (user ID) is required");
    }

    // Find the task
    const task = await Task.findById(taskId);
    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    // Add new activity log
    task.activityLogs.push({
      message: message.trim(),
      createdBy,
      createdAt: new Date(),
    });

    await task.save();

    res.status(200).json({
      success: true,
      message: "Activity added successfully",
      activityLogs: task.activityLogs,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }
    // Fallback error response
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
}
