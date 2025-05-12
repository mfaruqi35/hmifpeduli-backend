import { v2 as cloudinary } from "cloudinary";
import { configDotenv } from "dotenv";
import { Readable } from "stream";
configDotenv();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CODE_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    Readable.from(buffer).pipe(stream);
  });
};

export default cloudinary;
