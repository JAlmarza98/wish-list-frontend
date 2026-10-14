import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService, Credential } from '@auth/auth.service';
import { MATERIAL_MODULES } from '@shared/material.module';
import { SnackbarService } from '@shared/snackbar/snackbar.service';

interface LogInForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MATERIAL_MODULES,
    ReactiveFormsModule,
    RouterLink,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  hide: boolean = true;
  loginForm!: FormGroup<LogInForm>;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private snackBar: SnackbarService,
    private _router: Router
  ) {
    this.loginForm = this.fb.group({
      email: this.fb.control('', {
        validators: [Validators.required, Validators.email],
        nonNullable: true,
      }),
      password: this.fb.control('', {
        validators: Validators.required,
        nonNullable: true,
      }),
    });
  }

  logIn(): void {
    if (this.loginForm.invalid) return;

    const credential: Credential = {
      email: this.loginForm.value.email || '',
      password: this.loginForm.value.password || '',
    };

    this.auth.logInWithEmailAndPassword(credential).subscribe({
      next: () => {
        this.snackBar.showSnackBar('Se ha iniciado sesión correctamente', 'succes');
        this._router.navigateByUrl('/');
      },
      error: (error) => {
        console.error(error);
        this.snackBar.showSnackBar('Esas credenciales no son validas', 'error');
      },
    });
  }
}
