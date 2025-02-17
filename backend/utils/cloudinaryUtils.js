const cloudinary = require("cloudinary").v2; 
const fs = require("fs"); 
const path = require("path"); 

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Function to handle cloudinary upload and local file removal
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const absoluteFilePath = path.resolve(localFilePath); // Resolve file path for cloudinary

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      transformation: [
        { width: 250, height: 250, crop: "thumb", gravity: "face" },  // Focus on the face
        { radius: "max" },  // Make the image rounded
      ],
    })

    // File uploaded successfully, remove local file
    fs.unlinkSync(absoluteFilePath);
    console.log("File uploaded on Cloudinary: ", response.url);

    return response;
  } catch (error) {
    // If upload fails, remove the local temp file
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    console.error("Error uploading to Cloudinary: ", error);
    return null;
  }
};

module.exports = { uploadOnCloudinary };
