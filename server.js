import express from "express";
import multer from "multer";
import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";

const app = express();
const port = 3000;

// Middleware to serve frontend
app.use(express.static("public"));

// Storage setup for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Upload & extract route
app.post("/extract", upload.single("video"), (req, res) => {
  const videoPath = req.file.path;
  const audioFilename = `${Date.now()}.mp3`;
  const audioPath = path.join("uploads", audioFilename);

  ffmpeg(videoPath)
    .noVideo()
    .audioCodec("libmp3lame")
    .save(audioPath)
    .on("end", () => {
      res.download(audioPath, () => {
        fs.unlinkSync(videoPath);
        fs.unlinkSync(audioPath);
      });
    })
    .on("error", (err) => {
      console.error(err);
      res.status(500).send("Error extracting audio.");
    });
});

app.listen(port, () => console.log(`✅ Server running at http://localhost:${port}`));
