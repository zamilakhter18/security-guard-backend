import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class ExecutionTimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now(); // Start time

    return next.handle().pipe(
      tap(() => {
        const executionTime = Date.now() - start; // End time
        const request = context.switchToHttp().getRequest();
        console.log(`⏳ API [${request.method}] ${request.url} took ${executionTime}ms`);
      })
    );
  }
}
