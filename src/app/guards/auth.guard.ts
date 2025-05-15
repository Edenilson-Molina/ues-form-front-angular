import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { map, take } from "rxjs";
import { AuthService } from "@app/services/auth.service";

@Injectable({
  providedIn: "root",
})

export class AuthGuard implements CanActivate{
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(
      take(1), // Toma solo el primer valor emitido y completa la suscripción
      map((isAuthenticate) => {
        // Si no está autenticado, redirigir al login
        if (!isAuthenticate) {
          this.router.navigate(["/login"]);
        }

        // Verificar permisos
        const permissions = route.data["Permissions"] as string[];
        const hasAuthPermissions = this.authService.getPermissions();
        if (permissions && permissions.length > 0) {
          const hasPermission = permissions.some((permission) => hasAuthPermissions.includes(permission));
          if (!hasPermission) {
            this.router.navigate(["/dashboard"]);
            return false;
          }
        }

        return isAuthenticate;
      })
    );
  }

}
