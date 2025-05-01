import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { Observable } from "rxjs";
import { map, take } from "rxjs";
import { AuthService } from "@app/services/auth.service";

@Injectable({
  providedIn: "root",
})

export class AuthGuard implements CanActivate{
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(
      take(1), // Toma solo el primer valor emitido y completa la suscripción
      map((isAuthenticate) => {
        if (!isAuthenticate) {
          this.router.navigate(["/login"]);
        }
        return isAuthenticate;
      })
    );
  }

}
