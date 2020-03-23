import { Injectable } from '@angular/core';
import { BaseRequestOptions, RequestOptionsArgs, RequestOptions } from '@angular/http';
import { ApplicationEnvironmentService } from 'app/services/application-environment/application-environment.service';
/**
 * Extending BaseRequestOptions to inject common headers to all requests.
 */
@Injectable()
//export class CustomRequestOptions extends BaseRequestOptions {
    export class CustomRequestOptions extends BaseRequestOptions {
    constructor(private appEnvService: ApplicationEnvironmentService) {
        super();
        // if (this.appEnvService.userSession.securityToken) {
        //     console.log("Adding authorization token");
        //     let token: string = 'Bearer ' + this.appEnvService.userSession.securityToken;
        //     this.headers.append('Authorization', token);
        // }
        //this.headers.append('foo', 'bar');
    }

    merge(options?: RequestOptionsArgs): RequestOptions {
        var newOptions = super.merge(options);
        if (this.appEnvService.userSession.isSessionActive) {
            let securityToken: string = this.appEnvService.userSession.securityToken;

            if (securityToken) {
                let token = 'Bearer ' + securityToken;
                newOptions.headers.set('Authorization', token);
            }
        }
        return newOptions;
    }
}
