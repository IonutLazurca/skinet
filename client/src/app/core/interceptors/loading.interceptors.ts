import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { delay, finalize } from 'rxjs/operators';
import { BussyService } from '../services/bussy.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

    constructor(private bussyService: BussyService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.bussyService.bussy();
        return next.handle(req).pipe(
            delay(1000),
            finalize(() => {
                this.bussyService.idle();
            })            
        );
    }
}
