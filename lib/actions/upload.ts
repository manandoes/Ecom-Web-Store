"use server";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImageAction(base64Image: string, folder: string = "lumina") {
  try {
    const result = await cloudinary.uploader.upload(base64Image, {
      folder,
      resource_type: "image",
    });
    return { success: true, url: result.secure_url, publicId: result.public_id };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return { success: false, error: "Failed to upload image to Cloudinary." };
  }
}
