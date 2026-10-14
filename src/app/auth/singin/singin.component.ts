import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, RegisterPayload } from '@auth/auth.service';
import { MATERIAL_MODULES } from '@shared/material.module';
import { SnackbarService } from '@shared/snackbar/snackbar.service';

interface RegisterForm {
  email: FormControl<string>;
  username: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-singin',
  standalone: true,
  imports: [
    MATERIAL_MODULES,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './singin.component.html',
  styleUrl: './singin.component.css'
})
export class SinginComponent {
  hide: boolean = true;
  registerForm!: FormGroup<RegisterForm>;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private snackBar: SnackbarService,
    private _router: Router
  ) {
    this.registerForm = this.fb.group({
      email: this.fb.control('', {
        validators: [Validators.required, Validators.email],
        nonNullable: true,
      }),
      username: this.fb.control('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      password: this.fb.control('', {
        validators: [Validators.required, Validators.minLength(8)],
        nonNullable: true,
      }),
    });
  }

  signUp(): void {
    if (this.registerForm.invalid) return;

    const payload: RegisterPayload = {
      email: this.registerForm.value.email || '',
      username: this.registerForm.value.username || '',
      password: this.registerForm.value.password || '',
    };

    this.auth.registerWithEmailAndPassword(payload).subscribe({
      next: () => {
        this.snackBar.showSnackBar('Se ha registrado correctamente', 'succes');
        this._router.navigateByUrl('/');
      },
      error: (error) => {
        console.error(error);
        this.snackBar.showSnackBar(error?.error?.error ?? 'Ese email ya esta registrado', 'error');
      },
    });
  }
}
