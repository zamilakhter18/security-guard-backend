import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class ResponseHandler {
  successResponse(res: Response, msg: string) {
    return res.status(200).json({ statusCode: 200, message: msg });
  }

  successResponseWithData(res: Response, msg: string, responseData ) {
    return res
      .status(200)
      .json({ statusCode: 200, message: msg, data: responseData });
  }

  successResponseWithToken(res: Response, token: string, msg: string) {
    return res.status(200).json({
      statusCode: 200,
      token: token,
      message: msg,
    });
  }

  successResponseWithDataAndToken(
    res: Response,
    responseData = {},
    token: string,
    msg: string,
  ) {
    return res.status(200).json({
      statusCode: 200,
      data: responseData,
      token: token,
      message: msg,
    });
  }

  errorResponse(res: Response, msg: string) {
    return res.status(400).json({ statusCode: 400, message: msg });
  }

  errorResponseWithData(res: Response, msg: string, responseData: any) {
    return res.status(400).json({
      statusCode: 400,
      message: msg,
      data: responseData,
    });
  }

  unAuthorizeErrorResponse(res: any, msg: string) {
    return res.status(401).json({ statusCode: 401, message: msg });
  }

  catchErrorResponse(res: any, error: string) {
    return res.status(500).json({ statusCode: 500, error: error });
  }
}
