import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { delay, switchMap } from "rxjs/operators";

const MIN_DELAY = 500;
const MAX_DELAY = 1200;

function randomDelayMs(): number {
    return Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY + 1)) + MIN_DELAY;
}

function randomId(prefix: string): string {
    return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

type OrderStatus = 'PAGO' | 'PENDENTE' | 'CANCELADO';

type Order = {id: string; data: number; cliente: string; valor: number; status: OrderStatus;};

@Injectable({ providedIn: 'root' })
export class ApiMockService {
    private get passwords(): Record<string, string> {
        return JSON.parse(localStorage.getItem('mock_passwords') ?? '{}');
    }
    private set passwords(v: Record<string, string>) {
        localStorage.setItem('mock_passwords', JSON.stringify(v));
    }
    private get resets(): Record<string, { email: string; expiresAt: number; resendAt: number }> {
        return JSON.parse(localStorage.getItem('mock_resets') ?? '{}');
    }
    private set resets(v: Record<string, { email: string; expiresAt: number; resendAt: number }>) {
        localStorage.setItem('mock_resets', JSON.stringify(v));
    }

    seedUser(email: string, password: string): void {
    const db = this.passwords;
    db[email.toLowerCase()] = password;
    this.passwords = db;
    }

    login(email: string, password: string): Observable<{ token: string }> {
        return of(null).pipe(delay(randomDelayMs()), switchMap(() => {
            const db = this.passwords;
            const saved = db[email.toLowerCase()];

            if (!saved) return throwError(() => new Error('Email ou senha inválido.'));
            if (saved !== password) return throwError(() => new Error('Senha inválida.'));

            return of({ token: randomId('token') });
        }));
    }

    createPassword(email: string, code: string, newPassword: string): Observable<void> {
        const CODE_OK = '123456';

        return of(null).pipe(
            delay(randomDelayMs()),
            switchMap(() => {

                if (code !== CODE_OK) return throwError(() => new Error('Código inválido.'));

                const db = this.passwords;
                db[email.toLowerCase()] = newPassword;
                this.passwords = db;

                return of(void 0);
            })
        );
    }

    requestPasswordReset(email: string): Observable<{ resetId: string; expiresAt: number; resendAt: number }> {
        return of(null).pipe(
            delay(randomDelayMs()),
            switchMap(() => {
                const resetId = randomId('reset');
                const now = Date.now();

                const expiresAt = now + 2 * 60 * 1000;
                const resendAt = now + 30 * 1000;

                const db = this.resets;
                db[resetId] = { email: email.toLowerCase(), expiresAt, resendAt };
                this.resets = db;

                return of({ resetId, expiresAt, resendAt });
            })
        );
    }

    resendResetCode(resetId: string): Observable<{ resendAt: number }> {
        return of(null).pipe(
            delay(randomDelayMs()),
            switchMap(() => {
                const db = this.resets;
                const item = db[resetId];
                if (!item) return throwError(() => new Error('Reset inválido.'));

                const now = Date.now();
                if (now < item.resendAt) return throwError(() => new Error('Aguarde para reenviar o código.'));

                item.resendAt = now + 30 * 1000;
                db[resetId] = item;
                this.resets = db;

                return of({ resendAt: item.resendAt });
            })
        );
    }

    confirmPasswordReset(resetId: string, code: string, newPassword: string): Observable<void> {
        const CODE_OK = '123456';

        return of(null).pipe(
            delay(randomDelayMs()),
            switchMap(() => {
                const db = this.resets;
                const item = db[resetId];
                if (!item) return throwError(() => new Error('Reset inválido.'));

                const now = Date.now();
                if (now > item.expiresAt) return throwError(() => new Error('Código expirado. Solicite novamente.'));
                if (code !== CODE_OK) return throwError(() => new Error('Código inválido.'));

                const passDb = this.passwords;
                passDb[item.email] = newPassword;
                this.passwords = passDb;

                delete db[resetId];
                this.resets = db;

                return of(void 0);
            })
        );
    }

    getDashboard(period: 7 | 30): Observable<{
        userEmail: string | null;
        kpis: { receita: number; pedidos: number; ticketMedio: number };
        orders: Order[];
    }> {
        return of(null).pipe(
            delay(randomDelayMs()),
            switchMap(() => {
                const userEmail = localStorage.getItem('auth_email');

                const now = Date.now();
                const days = period;

                const orders: Order[] = Array.from({ length: Math.max(10, days) }).map((_, i) => {
                    const dayOffset = i % days;
                    const data = now - dayOffset * 86400000;

                    const valor = Math.round((50 + Math.random() * 450) * 100) / 100;

                    const status: OrderStatus =
                        i % 5 === 0 ? 'CANCELADO' :
                            i % 3 === 0 ? 'PENDENTE' : 'PAGO';

                    return {
                        id: randomId('order'),
                        data,
                        cliente: `Cliente ${i + 1}`,
                        valor,
                        status,
                    };
                });

                const receita = orders
                    .filter(o => o.status === 'PAGO')
                    .reduce((acc, o) => acc + o.valor, 0);

                const pedidos = orders.length;
                const ticketMedio = pedidos > 0 ? receita / pedidos : 0;

                return of({
                    userEmail,
                    kpis: { receita, pedidos, ticketMedio },
                    orders,
                });
            })
        );
    }
}