import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MATERIAL_MODULES } from '@shared/material.module';
import { AddToListForm } from '../add-to-list/add-to-list.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Wish } from '@components/list/list.component';

@Component({
  selector: 'app-update-of-list',
  standalone: true,
  imports: [MATERIAL_MODULES, ReactiveFormsModule],
  templateUrl: './update-of-list.component.html',
  styles: [`
    mat-form-field {width: 100%;}
  `]
})
export class UpdateOfListComponent {
  updateOfList!: FormGroup<AddToListForm>;

  readonly dialogRef = inject(MatDialogRef<UpdateOfListComponent>);
  readonly data = inject<{row:Wish}>(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.updateOfList = this.fb.group({
      title: this.fb.control(this.data.row.title, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      description: this.fb.control(this.data.row.description, {
        validators: [],
        nonNullable: true,
      }),
      url: this.fb.control(this.data.row.url, {
        validators: [],
        nonNullable: true,
      })
    });
  }
}
