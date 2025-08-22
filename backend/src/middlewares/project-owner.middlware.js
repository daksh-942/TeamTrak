import Project from "../models/project.model.js";
import { ApiError } from "../utils/ApiError.js";

export const isProjectOwner = async (req, res, next) => {
  try {
    let { project: projectId } = req.body;

    if (!projectId) projectId = req.params.projectId; // if not found in request body

    if (!projectId) {
      throw new ApiError(400, "Project ID is required.");
    }

    const project = await Project.findById(projectId);

    if (!project) {
      throw new ApiError(404, "Project not found.");
    }

    // Check if the logged-in user is the owner
    if (project.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "Access denied. Only project owner allowed.");
    }

    // Attach project to request for easier access in controller
    req.project = project;

    next();
  } catch (error) {
    console.log("Error in isProjectOwner", error);
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};
