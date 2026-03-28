import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';

const UPLOADS_DIR   = '/app/uploads/avatars';
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: UPLOADS_DIR,
  filename: (req, file, cb) => {
    const ext  = path.extname(file.originalname).toLowerCase();
    const name = `${req.user.id}-${crypto.randomBytes(6).toString('hex')}${ext}`;
    cb(null, name);
  },
});

export const uploadAvatar = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_TYPES.has(file.mimetype)) cb(null, true);
    else cb(new Error('Type de fichier non autorisé (jpg, png, webp)'));
  },
}).single('avatar');
