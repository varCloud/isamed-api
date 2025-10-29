import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { entityType, entityId } = req.params;
    
    const folderName = (() => {
      switch (entityType) {
        case "Order":
          return "order";
        case "Repair_report":
          return "repair-report";
        default:
          throw new Error("Invalid photoable type");
      }
    })();
    const uploadPath = path.join(__dirname, '..', 'media', 'service', folderName, entityId);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `${timestamp}${ext}`);
  },
});


const storageFormat = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadPath = path.join(__dirname, '..', 'media', 'formats');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `${timestamp}${ext}`);
  },
});

export const uploadFormat = multer({ storage:storageFormat });

export const upload = multer({ storage });
