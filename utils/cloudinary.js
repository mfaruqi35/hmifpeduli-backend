import { v2 as cloudinary } from "cloudinary";
import { configDotenv } from "dotenv";
import { Readable } from "stream";
configDotenv();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CODE_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = (buffer, folder, alias = null) => {
  return new Promise((resolve, reject) => {
    const options = { folder };
    if (alias) options.public_id = alias;

    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    Readable.from(buffer).pipe(stream);
  });
};

export default cloudinary;
