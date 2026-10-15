import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MATERIAL_MODULES } from '@shared/material.module';
import { AuthService } from '@auth/auth.service';
import { SnackbarService } from '@shared/snackbar/snackbar.service';

interface ChangePasswordForm {
  currentPassword: FormControl<string>;
  newPassword: FormControl<string>;
  confirmPassword: FormControl<string>;
}

function passwordsMatch(group: FormGroup<ChangePasswordForm>): ValidationErrors | null {
  const newPassword = group.controls.newPassword.value;
  const confirmPassword = group.controls.confirmPassword.value;
  return newPassword && confirmPassword && newPassword !== confirmPassword ? { mismatch: true } : null;
}

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [MATERIAL_MODULES, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styles: [`
    .form { display: flex; flex-direction: column; gap: 16px; padding: 6px 2px 2px 2px; }
    .mandatory-note { font-size: 12.5px; color: var(--color-text-secondary); margin: 0 0 4px 0; }
  `]
})
export class ChangePasswordComponent {
  form: FormGroup<ChangePasswordForm>;
  submitting = false;

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private snackbar = inject(SnackbarService);
  private dialogRef = inject(MatDialogRef<ChangePasswordComponent>);
  readonly data = inject<{ mandatory: boolean } | null>(MAT_DIALOG_DATA, { optional: true });

  constructor() {
    this.form = this.fb.group({
      currentPassword: this.fb.control('', { validators: [Validators.required], nonNullable: true }),
      newPassword: this.fb.control('', { validators: [Validators.required, Validators.minLength(8)], nonNullable: true }),
      confirmPassword: this.fb.control('', { validators: [Validators.required], nonNullable: true }),
    }, { validators: passwordsMatch as any });
  }

  get mandatory(): boolean {
    return !!this.data?.mandatory;
  }

  submit(): void {
    if (this.form.invalid || this.submitting) return;
    this.submitting = true;

    const { currentPassword, newPassword } = this.form.getRawValue();
    this.auth.changePassword(currentPassword, newPassword).subscribe({
      next: () => {
        this.snackbar.showSnackBar('Contraseña actualizada', 'succes');
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.submitting = false;
        this.snackbar.showSnackBar(err?.error?.error ?? 'No se ha podido cambiar la contraseña', 'error');
      },
    });
  }
}
