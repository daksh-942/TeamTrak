import Team from "../models/team.model.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";

export async function createTeam(req, res) {
  try {
    const { name, description } = req.body;
    const user = req.user;
    if (!name?.trim()) throw new ApiError(400, "Team name is required");

    const team = new Team({
      name: name.trim(),
      description,
      owner: req.user._id,
    });

    team.activityLogs.push({ message: `Team created by ${user.firstname}` });
    team.members.push({ user: user._id, role: "Owner" });

    await team.save();
    res.status(201).json({ success: true, data: team });
  } catch (error) {
    if (error instanceof ApiError) {
      res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    } else {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
}

export async function getAllTeams(req, res) {
  try {
    const userId = req.user._id;
    const teams = await Team.find({
      $or: [{ owner: userId }, { "members.user": userId }],
    })
      .populate("owner", "firstname lastname email")
      .populate("members.user", "firstname lastname email")
      .populate("project")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: teams,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    } else {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
}

export async function inviteUserToTeam(req, res) {
  try {
    const { email, role = "Developer" } = req.body;
    const { teamId } = req.params;

    const team = await Team.findById(teamId);
    if (!team) throw new ApiError(404, "Team does not exist");

    const user = req.user;
    if (user.email === email)
      throw new ApiError(400, "You are already a part of this project.");

    const token = jwt.sign(
      { inviter: user.firstname, teamName: team.name, email, teamId, role },
      process.env.JWT_SECRET,
      {
        expiresIn: "2d",
      }
    );
    if (!token) throw new ApiError(400, "Token not generated.");

    const inviteLink = `${process.env.CLIENT_URL}/team-invite?token=${token}`;

    await sendEmail({
      to: email,
      subject: "You are invited to join a team",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f7; padding: 30px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
            <h1 style="color: #333333; font-size: 24px; margin-bottom: 10px;">
              ${user.firstname} has invited you to join a team!
            </h1>
            <h2 style="color: #555555; font-size: 18px; margin-top: 0;">
              Are you ready to being a part to <em style="color: #1a73e8;">${team.name}</em>?
            </h2>
            <p style="color: #555555; font-size: 16px; line-height: 1.5;">
              You have been invited to join a team. This is your chance to make an impact and work with a great team.
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
    console.log("Error in inviteUserToTeam", error);
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

export async function acceptTeamInvite(req, res) {
  try {
    const user = req.user;
    const { token } = req.body;
    const { email, teamId, role } = jwt.decode(token);

    if (user.email !== email)
      throw new ApiError(403, "Invite email does not match with your account");

    const team = await Team.findById(teamId);
    if (!team) throw new ApiError(404, "Team not found.");

    // check if user is already a member
    const alreadyMember = team.members.some(
      (member) => member.user.toString() === user._id.toString()
    );

    if (alreadyMember)
      throw new ApiError(400, "User is already member of team");

    team.members.push({ user: user._id, role });

    team.activityLogs.push({
      message: `${user.firstname} ${user.lastname} has joined as a ${role}`,
      createdBy: req.user._id,
    });

    await team.save();

    return res.status(200).json({
      success: true,
      message: "Member added successfully.",
      teamId,
    });
  } catch (error) {
    console.log("Error in acceptTeamInvite", error);
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

// ------ NOT TESTED ------------------

export async function getTeamById(req, res) {
  try {
    const { id } = req.params;

    // Validate id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid team ID");
    }

    const team = await Team.findById(id)
      .populate("project", "name description")
      .populate("members.user", "name email");

    if (!team) {
      throw new ApiError(404, "Team not found");
    }

    res.status(200).json({
      success: true,
      data: team,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function updateTeam(req, res) {
  try {
    const { id } = req.params;
    const { name, description, project, members } = req.body;

    // Validate id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid team ID");
    }

    // Validate required fields if provided
    if (name !== undefined && typeof name !== "string") {
      throw new ApiError(400, "Team name must be a string");
    }

    if (project !== undefined && !mongoose.Types.ObjectId.isValid(project)) {
      throw new ApiError(400, "Invalid project ID");
    }

    if (members !== undefined) {
      if (!Array.isArray(members)) {
        throw new ApiError(400, "Members must be an array");
      }
      // Validate each member structure
      for (const member of members) {
        if (!member.user || !mongoose.Types.ObjectId.isValid(member.user)) {
          throw new ApiError(400, "Each member must have a valid user ID");
        }
        if (
          member.role !== undefined &&
          !["lead", "developer", "designer", "qa", "support"].includes(
            member.role
          )
        ) {
          throw new ApiError(400, "Invalid member role");
        }
      }
    }

    const team = await Team.findById(id);
    if (!team) {
      throw new ApiError(404, "Team not found");
    }

    // Update fields if provided
    if (name !== undefined) team.name = name;
    if (description !== undefined) team.description = description;
    if (project !== undefined) team.project = project;
    if (members !== undefined) team.members = members;

    await team.save();

    res.status(200).json({
      success: true,
      data: team,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function deleteTeam(req, res) {
  try {
    const { id } = req.params;

    // Validate team ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid team ID");
    }

    const team = await Team.findById(id);
    if (!team) {
      throw new ApiError(404, "Team not found");
    }

    await Team.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Team deleted successfully",
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function addTeamActivity(req, res) {
  try {
    const { id } = req.params; // team id
    const { message, createdBy } = req.body;

    // Validate team ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid team ID");
    }

    // Validate required fields
    if (!message || !message.trim()) {
      throw new ApiError(400, "Activity message is required");
    }

    if (!createdBy || !mongoose.Types.ObjectId.isValid(createdBy)) {
      throw new ApiError(400, "Valid createdBy user ID is required");
    }

    const team = await Team.findById(id);
    if (!team) {
      throw new ApiError(404, "Team not found");
    }

    team.activityLogs.push({ message: message.trim(), createdBy });
    await team.save();

    res.status(200).json({
      success: true,
      message: "Activity added successfully",
      activityLogs: team.activityLogs,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function addTeamMember(req, res) {
  try {
    const { id } = req.params; // team ID
    const { user, role = "developer" } = req.body;

    // Validate team ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid team ID");
    }

    // Validate user ID
    if (!user || !mongoose.Types.ObjectId.isValid(user)) {
      throw new ApiError(400, "Valid user ID is required");
    }

    // Validate role
    const validRoles = ["lead", "developer", "designer", "qa", "support"];
    if (!validRoles.includes(role)) {
      throw new ApiError(400, `Role must be one of: ${validRoles.join(", ")}`);
    }

    const team = await Team.findById(id);
    if (!team) {
      throw new ApiError(404, "Team not found");
    }

    // Check if user is already a member
    const isMemberExists = team.members.some(
      (member) => member.user.toString() === user
    );
    if (isMemberExists) {
      throw new ApiError(400, "User is already a team member");
    }

    // Add new member
    team.members.push({ user, role });
    await team.save();

    res.status(200).json({
      success: true,
      message: "Member added successfully",
      members: team.members,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function removeTeamMember(req, res) {
  try {
    const { id, memberId } = req.params; // team ID and user ID to remove

    // Validate team ID and member ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid team ID");
    }
    if (!mongoose.Types.ObjectId.isValid(memberId)) {
      throw new ApiError(400, "Invalid member ID");
    }

    const team = await Team.findById(id);
    if (!team) {
      throw new ApiError(404, "Team not found");
    }

    // Check if the member exists in the team
    const memberIndex = team.members.findIndex(
      (member) => member.user.toString() === memberId
    );
    if (memberIndex === -1) {
      throw new ApiError(404, "Member not found in the team");
    }

    // Remove the member
    team.members.splice(memberIndex, 1);
    await team.save();

    res.status(200).json({
      success: true,
      message: "Member removed successfully",
      members: team.members,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function updateTeamMemberRole(req, res) {
  try {
    const { id, memberId } = req.params; // team ID and member user ID
    const { role } = req.body;

    // Validate team ID and member ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid team ID");
    }
    if (!mongoose.Types.ObjectId.isValid(memberId)) {
      throw new ApiError(400, "Invalid member ID");
    }

    // Validate role
    const validRoles = ["lead", "developer", "designer", "qa", "support"];
    if (!role || !validRoles.includes(role)) {
      throw new ApiError(400, `Role must be one of: ${validRoles.join(", ")}`);
    }

    const team = await Team.findById(id);
    if (!team) {
      throw new ApiError(404, "Team not found");
    }

    // Find the member
    const member = team.members.find(
      (member) => member.user.toString() === memberId
    );
    if (!member) {
      throw new ApiError(404, "Member not found in the team");
    }

    // Update the role
    member.role = role;
    await team.save();

    res.status(200).json({
      success: true,
      message: "Member role updated successfully",
      member,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
