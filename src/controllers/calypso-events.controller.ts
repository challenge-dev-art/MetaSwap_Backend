import { Request, Response, NextFunction } from 'express';

export class CalypsoEventsController {
  async handleEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
    res.json({
      message: 'OK',
    });
  }
}
