import { NextFunction, Request, Response } from 'express';
import { LanguageListing } from '@/interfaces/languages.interface';
import { languages } from '@/config/languages';

export class LanguagesController {
  public getLanguages = async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const response: LanguageListing = { items: languages };
    res.json(response);
  };
}
