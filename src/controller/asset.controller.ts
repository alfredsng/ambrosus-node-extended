import { Request } from 'express';
import { inject } from 'inversify';
import {
  BaseHttpController,
  controller,
  httpGet,
  httpPost,
  requestParam
} from 'inversify-express-utils';

import { TYPES } from '../constant/types';
import { IAnalytics } from '../interface/analytics.interface';
import { AssetService } from '../service/asset.service';
import { Asset, APIQuery, APIResult } from '../model';

@controller('/asset', TYPES.AuthorizeMiddleWare)
export class AssetController extends BaseHttpController implements IAnalytics {
  constructor(@inject(TYPES.AssetService) private assetService: AssetService) {
    super();
  }

  @httpGet('/')
  public getAssets(): Promise<APIResult> {
    return this.assetService.getAssets();
  }

  @httpGet('/:assetId')
  public get(@requestParam('assetId') assetId: string): Promise<Asset> {
    return this.assetService.getAsset(assetId);
  }

  @httpPost('/query')
  public query(req: Request): Promise<APIResult> {
    return this.assetService.getQueryResults(APIQuery.create(req));
  }

  @httpGet('/count')
  public async getCount(): Promise<any> {
    return this.assetService.getCountTotal();
  }

  @httpGet('/count/mtd')
  public async getCountByMonthToDate(): Promise<any> {
    return this.assetService.getCountByMonthToDate();
  }

  @httpGet('/count/date/:date')
  public async getCountByDate(
    @requestParam('date') date: string
  ): Promise<any> {
    return this.assetService.getCountByDate(date);
  }

  @httpGet('/count/daterange/:start/:end')
  public async getCountByDateRange(
    @requestParam('start') start: string,
    @requestParam('end') end: string
  ): Promise<any> {
    return this.assetService.getCountByDateRange(start, end);
  }

  @httpGet('/count/rolling/hours/:hours')
  public async getCountByRollingHours(
    @requestParam('hours') num: number
  ): Promise<any> {
    return this.assetService.getCountByRollingHours(num);
  }

  @httpGet('/count/rolling/days/:days')
  public async getCountByRollingDays(
    @requestParam('days') num: number
  ): Promise<any> {
    return this.assetService.getCountByRollingDays(num);
  }
}
