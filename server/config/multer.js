const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userId = req.user.id;
    const dossierId = req.params.idDossier;
    const uploadPath = path.join('uploads', userId.toString(), dossierId ? dossierId.toString() : 'temp');

    // Ensure directory exists
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only certain file types
  if (
    file.mimetype.startsWith('image/') ||
    file.mimetype.startsWith('application/pdf') ||
    file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || // for .xlsx files
    file.mimetype === 'application/vnd.ms-excel' // for .xls files
  ) {
    cb(null, true);
  } else {
    cb(new Error('File type not supported'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
