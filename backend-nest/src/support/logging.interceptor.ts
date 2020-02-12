import { Logger, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

const logger = new Logger('监控');
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const after = Date.now();
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        if (!request || !request.method) {
            return next.handle();
        }
        return next
            .handle()
            .pipe(tap(() => logger.log(`${request.method} ${request.url}，处理耗时：${Date.now() - after}ms`)));
    }
};