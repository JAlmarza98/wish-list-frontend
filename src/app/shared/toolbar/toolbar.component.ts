import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@auth/auth.service';
import { MATERIAL_MODULES } from '@shared/material.module';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [MATERIAL_MODULES, RouterLink],
  template: `
    <mat-toolbar>
      <span [routerLink]="'/'" style="cursor: pointer;">Wish list</span>
      <span class="spacer"></span>
      <button mat-icon-button aria-label="Cerrar sesión"  matTooltip="Cerrar sesión" (click)="logOut()">
        <mat-icon>logout</mat-icon>
      </button>
    </mat-toolbar>
  `,
  styles: [`
    .spacer { flex: 1 1 auto; }
  `]
})
export class ToolbarComponent {

  private _router = inject(Router);
  private auth = inject(AuthService)

  logOut(): void {
    this.auth.logOut().subscribe({
      next: () => this._router.navigateByUrl('/auth/login'),
      error: (error) => console.log(error),
    });
  }
}
