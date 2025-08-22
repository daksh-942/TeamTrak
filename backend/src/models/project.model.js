import mongoose from "mongoose";
const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    deadline: {
      type: Date,
    },

    teams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        default: null,
      },
    ],

    tags: [
      {
        type: String,
      },
    ],

    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
          index: true,
        },
        role: {
          type: String,
          enum: ["owner", "manager", "developer", "designer", "qa", "viewer"],
          default: "developer",
        },
      },
    ],

    activityLogs: [
      {
        message: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],

    files: [
      {
        url: {
          type: String,
          default: "",
        },
        secure_url: {
          type: String,
          default: "",
        },
        resource_type: {
          type: String,
          default: "",
        },
        format: {
          type: String,
          default: "",
        },
        name: {
          type: String,
          default: "",
        },
        size: {
          type: Number,
        },
        uploadedAt: {
          type: Date,
        },
        public_id: {
          type: String,
          default: "",
        },
        asset_id: {
          type: Date,
          default: String,
          default: "",
        },
      },
    ],
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;
