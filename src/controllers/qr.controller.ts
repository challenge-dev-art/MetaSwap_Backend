import { RequestWithUser } from '@/interfaces/auth.interface';
import { Response, NextFunction } from 'express';
import QRCode from 'qrcode';

export class QrController {
  public async generateQr(req: RequestWithUser, res: Response, _next: NextFunction) {
    const text = req.query.text;
    if (typeof text !== 'string') {
      res.status(400).json({ message: 'text required' });
      return;
    }

    const svg = await QRCode.toString(text, {
      type: 'svg',
      margin: 0,
      color: {
        light: '#00000000',
      },
    });

    res.type('svg').send(svg);
  }
}
