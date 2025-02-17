const cloudinary = require("cloudinary").v2;  // Use `require` for Cloudinary
const fs = require("fs");  // Use `require` for fs
const path = require("path");  // Use `require` for path

// Cloudinary configuration (ensure you load environment variables)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload files to Cloudinary (with different handling for images and PDFs)
const uploadOnCloudinary = async (localFilePath, fileType) => {
  try {
    console.log(localFilePath);
    if (!localFilePath) return null;

    let response;

    if (fileType === "avatar") {
      // If the file is an avatar (image), apply face detection and rounding transformations
      response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "image",  // Specify that it's an image
        transformation: [
          { width: 250, height: 250, crop: "thumb", gravity: "face" },  // Focus on the face
          { radius: "max" },  // Make the image rounded
        ],
      });
    } else if (fileType === "pdf") {
      // If the file is a PDF, simply upload without any transformations
      response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "raw",  // Use "raw" for non-image files like PDFs
      });
    } else {
      // Handle other file types (optional)
      response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto",  // Automatically determine the type
      });
    }

    // File uploaded successfully, delete the local file
    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    // In case of error, remove the local file
    fs.unlinkSync(localFilePath);
    throw error;
  }
};

module.exports = { uploadOnCloudinary };
