import { ExceptionFilter, Logger, ArgumentsHost } from "@nestjs/common";

const logger = new Logger('Exception');

export class AnyExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const req = request;
        const errData = {
            method: request.method,
            path: request.path,
            params: request.params,
            body: request.body,
            user: req.user,
        };
        logger.error('Exception: \n', JSON.stringify(errData));
        console.error(exception);
        response
            .status(exception.status || 500)
            .send(exception.response || { message: exception.message || 'Internal Error' });
    }
};
