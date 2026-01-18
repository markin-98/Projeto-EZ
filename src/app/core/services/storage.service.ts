import { Injectable } from "@angular/core";

const KEYS = {
    token: 'auth_token',
    email: 'auth_email',
};

@Injectable({providedIn: 'root'})
export class StorageService{
    setToken(token: string): void{
        localStorage.setItem(KEYS.token, token);
    }

    getToken(): string | null {
        return localStorage.getItem(KEYS.token);
    }

    setEmail(email: string): void{
        localStorage.setItem(KEYS.email, email);
    }

    getEmail(): string | null{
        return localStorage.getItem(KEYS.email);
    }

    clear(): void{
        localStorage.removeItem(KEYS.token);
        localStorage.removeItem(KEYS.email);
    }
}