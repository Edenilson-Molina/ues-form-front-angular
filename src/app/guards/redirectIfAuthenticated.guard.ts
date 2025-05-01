import { CanActivate } from "@angular/router";
import { Injectable } from "@angular/core";
import { AuthService } from "@app/services/auth.service";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})

export class RedirectIfAuthenticatedGuard implements CanActivate{
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    // Verifica si el usuario está autenticado
    // Si está autenticado, redirige a la página de inicio ("/dashboard")
    return this.authService.isAuthenticated().pipe(
      take(1), // Toma solo el primer valor emitido y completa la suscripción
      map((isAuthenticated) => {
        if (isAuthenticated) {
          this.router.navigate(["/dashboard"]);
        }
        return !isAuthenticated;
      })
    );
  }
}
