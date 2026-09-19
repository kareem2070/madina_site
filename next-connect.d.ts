// types/next-connect.d.ts
declare module 'next-connect' {
    import { NextApiRequest, NextApiResponse } from 'next';
    import { IncomingMessage, ServerResponse } from 'http';
  
    type Middleware<TRequest, TResponse> = (req: TRequest, res: TResponse, next: (err?: any) => void) => void;
  
    interface Options<TRequest, TResponse> {
      onError?: (err: any, req: TRequest, res: TResponse, next: (err?: any) => void) => void;
      onNoMatch?: (req: TRequest, res: TResponse) => void;
    }
  
    interface NextConnect<TRequest = NextApiRequest, TResponse = NextApiResponse> {
      use(middleware: Middleware<TRequest, TResponse>): this;
      use(...middlewares: Middleware<TRequest, TResponse>[]): this;
      get(handler: Middleware<TRequest, TResponse>): this;
      get(...handlers: Middleware<TRequest, TResponse>[]): this;
      post(handler: Middleware<TRequest, TResponse>): this;
      post(...handlers: Middleware<TRequest, TResponse>[]): this;
      put(handler: Middleware<TRequest, TResponse>): this;
      put(...handlers: Middleware<TRequest, TResponse>[]): this;
      delete(handler: Middleware<TRequest, TResponse>): this;
      delete(...handlers: Middleware<TRequest, TResponse>[]): this;
      options(handler: Middleware<TRequest, TResponse>): this;
      options(...handlers: Middleware<TRequest, TResponse>[]): this;
      patch(handler: Middleware<TRequest, TResponse>): this;
      patch(...handlers: Middleware<TRequest, TResponse>[]): this;
      head(handler: Middleware<TRequest, TResponse>): this;
      head(...handlers: Middleware<TRequest, TResponse>[]): this;
    }
  
    export default function nextConnect<TRequest = NextApiRequest, TResponse = NextApiResponse>(options?: Options<TRequest, TResponse>): NextConnect<TRequest, TResponse>;
  }
  