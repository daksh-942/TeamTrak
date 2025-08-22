import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const getResourceType = (mimetype = "") => {
  if (mimetype.startsWith("image/")) return "image";
  if (mimetype.startsWith("video/")) return "video";
  return "raw";
};

const extractOrginalName = (name) => {
  const findIndex = name.lastIndexOf("_");
  const newName = name.slice(0, findIndex);
  return newName;
};

async function uploadOnCloudinary(file) {
  try {
    console.log(file);
    if (!file) throw new Error("file not found.");
    const resourceType = getResourceType(file.mimetype);
    const originalName = path.parse(file.originalname).name;
    const ext = path.extname(file.originalname).slice(1);

    const publicId = `${originalName}_${Date.now()}`;

    const uploadResult = await cloudinary.uploader.upload(file.path, {
      folder: "RemoteSync",
      resource_type: resourceType,
      public_id: publicId,
      format: ext,
    });

    fs.unlinkSync(file.path);
    console.log(uploadResult);
    return {
      url: uploadResult.url,
      secure_url: uploadResult.secure_url,
      resource_type: uploadResult.resource_type,
      format: ext,
      name: extractOrginalName(uploadResult.original_filename),
      size: uploadResult.bytes,
      uploadedAt: uploadResult.created_at,
      public_id: uploadResult.public_id,
      asset_id: uploadResult.asset_id,
    };
  } catch (error) {
    if (file) fs.unlinkSync(file.path);
    throw error;
  }
}

async function deleteFromCloudinary(file) {
  try {
    await cloudinary.uploader.destroy(file.public_id, {
      resource_type: file.resource_type,
    });
  } catch (error) {
    console.log(error);
  }
}

export { uploadOnCloudinary, deleteFromCloudinary };
