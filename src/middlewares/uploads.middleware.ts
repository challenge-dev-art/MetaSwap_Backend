import multer from 'multer';
import { tmpdir } from 'node:os';

export const UploadsMiddleware = multer({
  dest: tmpdir(),
  limits: {
    fileSize: 1024 * 1024 * 10, // 10MiB
  },
});
