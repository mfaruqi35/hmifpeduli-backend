import express from 'express';
import multer from 'multer';
import Grid from 'gridfs-stream';
import mongoose from 'mongoose';
import { Readable } from 'stream';

const router = express.Router();

// Setup GridFS
let gfs;
const db = mongoose.connection;
db.once("open", () => {
  gfs = Grid(db.db, mongoose.mongo);
  gfs.collection("uploads"); // Set collection name for storing files
});

// Setup Multer storage to store files in memory with increased file size limit
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // Set file size limit to 50MB
});

// Endpoint for uploading an image to MongoDB using GridFS
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  const { buffer, originalname, mimetype } = req.file;

  // Use GridFS to write the file to MongoDB
  const writeStream = gfs.createWriteStream({
    filename: originalname,
    content_type: mimetype,
  });

  // Create a readable stream from the file buffer and pipe it to GridFS
  const readableImageStream = Readable.from(buffer);
  readableImageStream.pipe(writeStream);

  writeStream.on('close', (file) => {
    // Send a response once the file is successfully uploaded
    res.status(200).json({
      message: 'File uploaded successfully!',
      fileId: file._id,
    });
  });

  writeStream.on('error', (err) => {
    console.log("Error during file upload:", err);
    res.status(500).json({ message: 'Error uploading file', error: err.message });
  });
});

// Endpoint to access the image by its ID
router.get('/image/:fileId', (req, res) => {
  const { fileId } = req.params;

  // Fetch the file by ID from GridFS
  gfs.files.findOne({ _id: mongoose.Types.ObjectId(fileId) }, (err, file) => {
    if (err || !file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Create a read stream from the file and pipe it to the response
    const readStream = gfs.createReadStream({ _id: file._id });
    res.set('Content-Type', file.contentType);
    readStream.pipe(res);
  });
});

export default router;
