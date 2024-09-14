import { NextFunction, Response } from 'express';
import { RequestWithUser } from '@/interfaces/auth.interface';
import Container from 'typedi';
import { VerificationService } from '@/services/verification.service';
import { VerificationRequestDto } from '@/dtos/verification.dto';
import { Verification as VerificationView } from '@/interfaces/verification.interface';
import * as fs from 'fs';

export class VerificationController {
  public verification = Container.get(VerificationService);

  public async getVerificatiion(req: RequestWithUser, res: Response, _next: NextFunction): Promise<void> {
    const verification = await this.verification.getVerification(req.user.id);

    res.json(verification);
  }

  public async requestVerification(req: RequestWithUser, res: Response, _next: NextFunction) {
    const body = req.body;
    console.log("req.body: ", req.body);
    console.log("req.files: ", req.files);
    if (body instanceof VerificationRequestDto === false) {
      throw new Error('body: VerificationRequestDto required');
    }

    if (!req.files) {
      res.status(400).json({
        message: 'files required',
      });
      return;
    }
    const photoDocFile = req.files['photoDoc']?.[0] as Express.Multer.File;
    if (!photoDocFile) {
      res.status(400).json({
        message: 'photoDoc required',
      });
      return;
    }
    const photoUserWithDocFile = req.files['photoUserWithDoc']?.[0] as Express.Multer.File;
    if (!photoUserWithDocFile) {
      res.status(400).json({
        message: 'photoUserWithDoc required',
      });
      return;
    }
    const clearFiles = () => Promise.all([fs.promises.unlink(photoDocFile.path), fs.promises.unlink(photoUserWithDocFile.path)]);

    if (!validatePhotoMime(photoDocFile)) {
      await clearFiles();
      res.status(400).json({
        message: 'photoDocFile: unsupported file type',
      });
      return;
    }
    if (!validatePhotoMime(photoUserWithDocFile)) {
      await clearFiles();
      res.status(400).json({
        message: 'photoUserWithDoc: unsupported file type',
      });
      return;
    }

    let verification: VerificationView;
    try {
      verification = await this.verification.requestVerification({
        userId: req.user.id,
        firstName: body.firstName,
        lastName: body.lastName,
        docId: body.docId,
      });
    } finally {
      await clearFiles();
    }

    res.json(verification);
  }
}

function validatePhotoMime(file: Express.Multer.File) {
  switch (file.mimetype) {
    case 'image/tiff':
    case 'image/jpeg':
    case 'image/png': {
      return true;
    }
    default: {
      return false;
    }
  }
}
