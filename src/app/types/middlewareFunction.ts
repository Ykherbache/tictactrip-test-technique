import { NextFunction, Request, Response } from 'express';
type MiddlewareReturnType = Response<void, Record<string, any>>;
export type MiddlewareFunction = (
  req: Request,
  res: Response,
  next?: NextFunction,
) => MiddlewareReturnType | Promise<MiddlewareReturnType>;
