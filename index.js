const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/stitch', upload.fields([{ name: 'audio' }, { name: 'video' }]), (req, res) => {
  const audioPath = req.files.audio[0].path;
  const videoPath = req.files.video[0].path;
  const outputPath = `output/${Date.now()}.mp4`;

  const command = `ffmpeg -i ${videoPath} -i ${audioPath} -c:v copy -c:a aac ${outputPath}`;
  exec(command, (error) => {
    if (error) return res.status(500).send('Stitching failed.');

    res.download(outputPath, () => {
      fs.unlinkSync(audioPath);
      fs.unlinkSync(videoPath);
      fs.unlinkSync(outputPath);
    });
  });
});

app.listen(3000, () => console.log('FFmpeg microservice running on port 3000'));