import { ApplicationEnvironmentService } from 'app/services/application-environment/application-environment.service';
import { HttpInterceptor, HttpRequest, HttpResponse, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    constructor(private appEnvService: ApplicationEnvironmentService) {
    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        //
        if (this.appEnvService.userSession.isSessionActive) {
            req = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + this.appEnvService.userSession.securityToken) });
        }
        return next.handle(req).pipe(map((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                console.log('event--->>>', event);
            }
            return event;
        }));
    }
}
