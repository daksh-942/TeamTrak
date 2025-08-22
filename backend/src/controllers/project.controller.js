import mongoose from "mongoose";
import Project from "../models/project.model.js";
import Team from "../models/team.model.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import Task from "../models/task.model.js";

async function sendMailToTeam(inviter, receiver, project) {
  try {
    const token = jwt.sign(
      {
        inviter: inviter.firstname,
        projectName: project.name,
        email: receiver.email,
        projectId: project.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2d",
      }
    );

    if (!token) throw new ApiError(400, "Token could not be created.");

    const inviteLink = `${process.env.CLIENT_URL}/project-invite?token=${token}`;
    await sendEmail({
      to: receiver.email,
      subject: "You are invited to join a project",
      html: `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f7; padding: 30px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
        <h1 style="color: #333333; font-size: 24px; margin-bottom: 10px;">
          ${inviter.firstname} has invited you to join a project!
        </h1>
        <h2 style="color: #555555; font-size: 18px; margin-top: 0;">
          Are you ready to contribute to <em style="color: #1a73e8;">${project.name}</em>?
        </h2>
        <p style="color: #555555; font-size: 16px; line-height: 1.5;">
          You have been invited to collaborate on an exciting project. This is your chance to make an impact and work with a great team.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${inviteLink}" style="display: inline-block; background-color: #1a73e8; color: #ffffff; padding: 12px 20px; font-size: 16px; text-decoration: none; border-radius: 6px;">
            Accept Invitation
          </a>
        </div>
        <p style="color: #999999; font-size: 14px; text-align: center;">
          If the button above doesn't work, copy and paste this link into your browser:<br/>
          <a href="${inviteLink}" style="color: #1a73e8;">${inviteLink}</a>
        </p>
      </div>
    </div>
  `,
    });
  } catch (error) {
    throw error;
  }
}

async function deleteFiles(files) {
  try {
    const deletePromises = files.map(
      async (file) => await deleteFromCloudinary(file)
    );
    await Promise.allSettled(deletePromises);
  } catch (error) {
    throw error;
  }
}

export async function createProject(req, res) {
  try {
    const { name, teamIds, tags } = req.body;
    if (!name) throw new ApiError(400, "Project name is required.");
    const user = req.user;

    let project = await Project.create({
      name,
      owner: req.user._id,
      members: [
        {
          user: user._id,
          role: "owner",
        },
      ],
      tags,
      activityLogs: [
        {
          message: `Project created by ${req.user.firstname}`,
          createBy: req.user._id,
        },
      ],
    });

    if (teamIds.length > 0) {
      const teams = await Team.find({ _id: { $in: teamIds } }).populate(
        "members.user",
        "email firstname"
      );

      let members = [];
      teams.forEach((team) => {
        members.push(...team.members);
      });

      const emailPromises = members
        .filter((member) => member.user._id.toString() !== user._id.toString())
        .map((member) =>
          sendMailToTeam(
            { firstname: user.firstname },
            { email: member.user.email },
            { id: project._id, name: project.name }
          )
        );
      await Promise.all(emailPromises);

      project.teams.push(...teamIds);
      await project.save();
    }

    project = await Project.findById(project._id)
      .populate("owner")
      .populate("teams")
      .populate("members.user");

    return res.status(201).json({
      success: true,
      message: "Project created successfully.",
      project,
    });
  } catch (error) {
    console.log("Error in createProject", error);
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

export async function getUserProjects(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;

    const userId = req.user._id;

    // calculate the number of documents to skip
    const skip = (page - 1) * limit;

    let filterQuery = {
      $or: [{ owner: userId }, { "members.user": userId }],
    };

    const totalItems = await Project.countDocuments(filterQuery);
    const totalPages = Math.ceil(totalItems / limit);

    // Handle sorting (optional)
    const sortField = req.query.sort_by || "createdAt"; // Default sort by creation date
    const sortOrder = req.query.order === "desc" ? -1 : 1; // 1 for asc, -1 for desc

    const sortOptions = { [sortField]: sortOrder };

    const projects = await Project.find(filterQuery)
      .populate("owner", "firstname lastname avatar")
      .populate("members.user", "firstname lastname avatar")
      .populate("teams")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      projects,
      totalPages,
      totalItems,
    });
  } catch (error) {
    console.log("Error in getUserProjects", error);
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

export async function getProjectById(req, res) {
  try {
    const { projectId } = req.params;

    // Validate projectId
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      throw new ApiError(400, "Invalid project ID");
    }

    const project = await Project.findById(projectId)
      .populate("owner", "firstname lastname avatar")
      .populate("members.user", "firstname lastname avatar")
      .populate("teams")
      .populate("activityLogs.createdBy", "firstname lastname avatar");

    if (!project) {
      throw new ApiError(404, "Project not found");
    }
    return res.status(200).json({
      success: true,
      message: "Project feteched successfully.",
      project,
    });
  } catch (error) {
    console.log("Error in getProjectById", error);
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

export async function updateProjectDescription(req, res) {
  try {
    const { projectId } = req.params;
    const { description } = req.body;

    if (
      !description ||
      description.trim() === "" ||
      typeof description !== "string"
    )
      throw new ApiError(400, "Valid description is required.");

    // check if project exists;
    const project = await Project.findById(projectId)
      .populate("owner", "firstname lastname avatar")
      .populate("members.user", "firstname lastname avatar")
      .populate("teams");
    if (!project) throw new ApiError(404, "Project not found.");

    // check if user is member of the project or not
    const userId = req.user._id;
    const isMember = project.members.some(
      (member) => member.user._id.toString() === userId.toString()
    );
    if (!isMember)
      throw new ApiError(403, "You are not a member of this project");

    project.description = description;
    project.activityLogs.push({
      message: `Project description was updated by ${req.user.firstname}.`,
      createdBy: req.user._id,
    });

    await project.save();

    return res.status(200).json({
      success: true,
      message: "Project description updated successfully.",
      project,
    });
  } catch (error) {
    console.log("Error in updateProjectDescription", error);
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

export async function inviteUserToProject(req, res) {
  try {
    const { projectId } = req.params;
    const { email } = req.body;

    const project = await Project.findById(projectId);
    if (!project) throw new ApiError(404, "Project not found");

    const user = req.user;
    if (user.email === email)
      throw new ApiError(400, "You are already part of this project.");

    const token = jwt.sign(
      { inviter: user.firstname, projectName: project.name, email, projectId },
      process.env.JWT_SECRET,
      {
        expiresIn: "2d",
      }
    );

    if (!token) throw new ApiError(400, "Token could not be created.");
    const inviteLink = `${process.env.CLIENT_URL}/project-invite?token=${token}`;
    await sendEmail({
      to: email,
      subject: "You are invited to join a project",
      html: `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f7; padding: 30px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
        <h1 style="color: #333333; font-size: 24px; margin-bottom: 10px;">
          ${user.firstname} has invited you to join a project!
        </h1>
        <h2 style="color: #555555; font-size: 18px; margin-top: 0;">
          Are you ready to contribute to <em style="color: #1a73e8;">${project.name}</em>?
        </h2>
        <p style="color: #555555; font-size: 16px; line-height: 1.5;">
          You have been invited to collaborate on an exciting project. This is your chance to make an impact and work with a great team.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${inviteLink}" style="display: inline-block; background-color: #1a73e8; color: #ffffff; padding: 12px 20px; font-size: 16px; text-decoration: none; border-radius: 6px;">
            Accept Invitation
          </a>
        </div>
        <p style="color: #999999; font-size: 14px; text-align: center;">
          If the button above doesn't work, copy and paste this link into your browser:<br/>
          <a href="${inviteLink}" style="color: #1a73e8;">${inviteLink}</a>
        </p>
      </div>
    </div>
  `,
    });

    return res.status(200).json({ message: "Invitation sent" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: error.message || "Failed to send invitation" });
  }
}

export async function acceptProjectInvite(req, res) {
  try {
    const { token } = req.body; // email of the user to be accepted
    const user = req.user;
    const { email, projectId } = jwt.decode(token);
    if (user.email !== email)
      throw new ApiError(403, "Invite email does not match with your account");

    const project = await Project.findById(projectId);
    if (!project) throw new ApiError(404, "Project not found");

    // check if user is already a member
    const alreadyMember = project.members.some(
      (member) => member.user.toString() === user._id.toString()
    );

    if (alreadyMember)
      throw new ApiError(400, "User is already member of project");

    project.members.push({ user: user._id });

    // log the activity
    project.activityLogs.push({
      message: `${user.firstname} ${user.lastname} has joined as a member`,
      createdBy: req.user._id,
    });

    await project.save();

    return res.status(200).json({
      success: true,
      message: "Member added successfully.",
      projectId,
    });
  } catch (error) {
    console.log("Error in acceptProjectInvite", error);
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

export async function uploadFiles(req, res) {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId)
      .populate("owner")
      .populate("members.user")
      .populate("teams");
    if (!project) throw new ApiError(404, "Project is not found.");

    const files = req.files;
    const results = await Promise.all(
      files.map((file) => uploadOnCloudinary(file))
    );

    project.files.push(...results);

    await project.save();

    return res
      .status(200)
      .json({ success: true, message: "Files uploaded successfully", project });
  } catch (error) {
    console.log("Error in upload files", error);
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

export async function updateProjectName(req, res) {
  try {
    const { name } = req.body;
    const { projectId } = req.params;
    if (!name) throw new ApiError(400, "Name is required.");

    let project = await Project.findById(projectId);
    if (!project) throw new ApiError(404, "Project not found.");

    project.name = name;

    await project.save();

    project = await Project.findById(projectId)
      .populate("owner")
      .populate("teams")
      .populate("members.user");

    return res.status(200).json({ success: true, project });
  } catch (error) {
    console.log("Error in updateProjectName", error);
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

export async function removeMemberFromProject(req, res) {
  try {
    // check does the requester is project owner
    const { projectId, memberId } = req.params;
    if (
      !mongoose.Types.ObjectId.toValid(projectId) ||
      !mongoose.Types.ObjectId.toValid(memberId)
    )
      throw new ApiError(400, "Invalid project ID or member ID");

    // check if project exists
    const project = await Project.findById(projectId);
    if (!project) throw new ApiError(404, "No project found.");

    // prevent owner from removing the project
    if (project.owner.toString() === memberId) {
      throw new ApiError(
        400,
        "The project owner cannot remove themselves from the project."
      );
    }

    // check does member belongs to the project
    const isMember = project.members.some(
      (member) => member.user.toString() === memberId
    );
    if (!isMember)
      throw new ApiError(
        404,
        "The specified member is not part of this project."
      );

    // Pull (remove) the member
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      {
        $pull: { members: { user: memberId } }, // remove member
        $push: {
          activityLogs: {
            message: `Member was removed from the project.`,
            createdBy: req.user._id,
          },
        }, // add activity log
      },
      { new: true }
    );

    if (!updatedProject) {
      throw new ApiError(404, "Project not found.");
    }

    return res.status(200).json({
      success: true,
      message: "Member removed successfully",
    });
  } catch (error) {
    console.log("Error in removeMemberFromProject", error);
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

export async function deleteProject(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId))
      throw new ApiError(400, "Invalid project ID.");

    const project = await Project.findById(projectId).session(session);
    if (!project) throw new ApiError(404, "Project not found.");

    await Task.deleteMany({ project: projectId }).session(session);
    await Team.deleteMany({ project: projectId }).session(session);
    await Project.findByIdAndDelete(projectId).session(session);

    await session.commitTransaction();
    session.endSession();

    await deleteFiles(project.files);

    return res.status(200).json({
      success: true,
      projectId,
      message: "Project deleted successfully.",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log("Error in deleteProject", error);
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

export async function changeProjectRole(req, res) {}
export async function leaveProject(req, res) {}

// -------- NOT TESTED ----------------------

export async function addMemberToProject(req, res) {
  try {
    const { projectId } = req.params;
    const { userId, role } = req.body;

    // validate inputs
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(projectId)
    )
      throw new ApiError(400, "Invalid Project ID or User ID");

    // find the project
    const project = await Project.findById(projectId);
    if (!project) throw new ApiError(404, "Project not found.");

    // check if user exits
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User to add not found.");

    // Check if the user is the owner
    if (project.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(
        403,
        "Only the project owner is authorized to perform this action"
      );
    }

    // check if user is already a member
    const alreadyMember = project.members.some(
      (member) => member.user.toString() === userId
    );
    if (alreadyMember)
      throw new ApiError(400, "User is already member of project");

    project.members.push({ user: userId, role });

    // log the activity
    project.activityLogs.push({
      message: `${user.firstname} ${
        user.lastname
      } was added to the project as ${role || "member"}.`,
      createdBy: req.user._id,
    });

    await project.save();

    return res
      .status(200)
      .json({ success: true, message: "Member added successfully." });
  } catch (error) {
    console.log("Error in addMemberToProject", error);
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}
// removeMemberFromProject  DELETE  /api/projects/:projectId/members/:memberId

// assignTeamToProject      POST    /api/projects/:projectId/assign-team
export async function assignTeamToProject(req, res) {
  try {
    const { teamId } = req.body;

    const project = req.project; // from isProjectOwner middleware

    if (!teamId) {
      throw new ApiError(400, "Team ID is required.");
    }

    const team = await Team.findById(teamId).populate(
      "members.user",
      "firstname lastname"
    );

    if (!team) {
      throw new ApiError(404, "Team not found.");
    }

    // Check if project already has a team
    if (project.team) {
      throw new ApiError(
        400,
        "Project already has a team assigned. Remove it first to assign a new one."
      );
    }

    project.team = teamId;

    // Add activity log
    project.activityLogs.push({
      message: `Team "${team.name}" was assigned to the project.`,
      createdBy: req.user._id,
    });

    await project.save();

    // Create notifications for each team member
    const notifications = team.members.map((member) => ({
      user: member.user._id,
      message: `You have been assigned to project "${project.name}".`,
      project: project._id,
    }));

    await Notification.insertMany(notifications);

    res.status(200).json({
      success: true,
      message: "Team assigned to project successfully and notifications sent.",
    });
  } catch (error) {
    console.log("Error in assignTeamToProject", error);
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

// getProjectTimeline       GET     /api/projects/:projectId/timeline
export async function getProjectTimeline(req, res) {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      throw new ApiError(400, "Project ID is required.");
    }

    const project = await Project.findById(projectId)
      .populate("activityLogs.createdBy", "firstname lastname avatar") // Populate who did the action
      .select("activityLogs name"); // Only fetch activityLogs and project name

    if (!project) {
      throw new ApiError(404, "Project not found.");
    }

    res.status(200).json({
      success: true,
      message: "Project timeline fetched successfully.",
      timeline: project.activityLogs,
    });
  } catch (error) {
    console.log("Error in getProjectTimeline", error);
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

// getProjectAnalytics      GET     /api/projects/:projectId/analytics
export async function getProjectAnalytics(req, res) {}
// leaveProject             POST    /api/projects/:projectId/leave

// changeProjectRole        PATCH   /api/projects/:projectId/members/:memberId/role
