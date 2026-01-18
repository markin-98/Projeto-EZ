import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ApiMockService } from './api-mock.service';
import { StorageService } from './storage.service';
import { VoidExpression } from '@angular/compiler';

@Injectable({providedIn: 'root'})
export class AuthService{
    constructor(
        private api: ApiMockService,
        private storage: StorageService,
        private router: Router
    ){}

    isAuthenticated(): boolean{
        return !!this.storage.getToken();
    }

    login(email: string, password: string): Observable<{ token: string}> {
        return this.api.login(email, password).pipe(
            tap(res => {
                this.storage.setToken(res.token);
                this.storage.setEmail(email)
            })
        );
    }

    logout(): void {
        this.storage.clear();
        this.router.navigate(['/login']);
    }
}