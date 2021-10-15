const cloudinary = require("cloudinary").v2;

export const cloudinaryConfig = () => {
  return cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
  });
};

export const cloudinaryUploader = async (file, folder) => {
  try {
    const result = await cloudinary.uploader.upload(file, { folder });
    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.log(error);
  }
};
