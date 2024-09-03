import { NextFunction, Response } from 'express';
import { AssetsService } from '@/services/assets.service';
import Container from 'typedi';
import { RequestWithUser } from '@/interfaces/auth.interface';

export class AssetsController {
  public assets = Container.get(AssetsService);

  public async getAssets(req: RequestWithUser, res: Response, _next: NextFunction): Promise<void> {
    const assetsListing = await this.assets.getAssetListingView(req.user.id);

    res.json(assetsListing);
  }
}
