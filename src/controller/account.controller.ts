import { Request, Response } from 'express';
import { checkSchema, param, body } from 'express-validator/check';
import { inject } from 'inversify';
import {
  controller,
  httpGet,
  httpPost,
  httpPut,
  request,
  requestParam,
  response,
  requestBody
} from 'inversify-express-utils';
import web3 = require('web3');

import { MIDDLEWARE, TYPE } from '../constant/types';
import { APIQuery, APIResponse, APIResponseMeta, AccountDetail } from '../model';
import { AccountService } from '../service/account.service';
import { BaseController } from './base.controller';

@controller('/account')
export class AccountController extends BaseController {
  constructor(@inject(TYPE.AccountService) private accountService: AccountService) {
    super();
  }

  @httpGet(
    '/',
    ...checkSchema(APIQuery.validationSchema()),
    MIDDLEWARE.ValidateRequest,
    MIDDLEWARE.Authorized
  )
  public async getAccounts(@request() req: Request): Promise<APIResponse> {
    try {
      const result = await this.accountService.getAccounts(APIQuery.fromRequest(req));
      const apiResponse = APIResponse.fromMongoPagedResult(result);
      return apiResponse;
    } catch (err) {
      return super.handleError(err);
    }
  }

  @httpGet(
    '/:address',
    param('address').custom(value => web3.utils.isAddress(value)),
    MIDDLEWARE.ValidateRequest,
    MIDDLEWARE.Authorized
  )
  public async getAccount(@requestParam('address') address: string): Promise<APIResponse> {
    try {
      const result = await this.accountService.getAccount(address);
      const apiResponse = APIResponse.fromSingleResult(result);
      return apiResponse;
    } catch (err) {
      return super.handleError(err);
    }
  }

  @httpPut(
    '/:address',
    param('address').custom(value => web3.utils.isAddress(value)),
    ...checkSchema(AccountDetail.validationSchema()),
    MIDDLEWARE.ValidateRequest,
    MIDDLEWARE.Authorized
  )
  public async updateAccountDetail(
    @requestParam('address') address: string,
    @request() req: Request
  ): Promise<APIResponse> {
    try {
      const result = await this.accountService.updateAccountDetail(
        address,
        AccountDetail.fromRequestForUpdate(req)
      );
      const apiResponse = APIResponse.fromSingleResult(result);
      return apiResponse;
    } catch (err) {
      return super.handleError(err);
    }
  }

  @httpGet(
    '/:address/exists',
    param('address').custom(value => web3.utils.isAddress(value)),
    MIDDLEWARE.ValidateRequest
  )
  public async getAccountExists(
    @requestParam('address') address: string,
    @response() res: Response
  ): Promise<APIResponse> {
    try {
      const result = await this.accountService.getAccountExists(address);
      const apiResponse = new APIResponse();
      apiResponse.meta = new APIResponseMeta(200);
      apiResponse.meta.exists = result;
      return apiResponse;
    } catch (err) {
      return super.handleError(err);
    }
  }

  @httpPost(
    '/query',
    ...checkSchema(APIQuery.validationSchema()),
    MIDDLEWARE.ValidateRequest,
    MIDDLEWARE.Authorized
  )
  public async queryAccounts(req: Request): Promise<APIResponse> {
    try {
      const result = await this.accountService.getAccounts(APIQuery.fromRequest(req));
      const apiResponse = APIResponse.fromMongoPagedResult(result);
      return apiResponse;
    } catch (err) {
      return super.handleError(err);
    }
  }

  @httpPost(
    '/secret',
    body('email')
      .isEmail()
      .normalizeEmail(),
    MIDDLEWARE.ValidateRequest
  )
  public async getEncryptedSecretByEmail(@requestBody() acc: AccountDetail): Promise<APIResponse> {
    try {
      const result = await this.accountService.getAccountEncryptedToken(acc.email);
      const apiResponse = APIResponse.fromSingleResult(result);
      return apiResponse;
    } catch (err) {
      return super.handleError(err);
    }
  }
}
