import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InvitesService } from 'src/app/services/invites.service';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-add-member',
  standalone: true,
  imports: [RouterModule],
  template: '',
  styles: ''
})
export class AddMemberComponent implements OnInit {
  private token: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private invitesService: InvitesService,
    private snackbarService: SnackbarService,
  ) {
    this.token = this.route.snapshot.paramMap.get('id') ?? '';
  }

  ngOnInit(): void {
    this.invitesService.previewInvite(this.token).pipe(
      switchMap(preview => this.invitesService.acceptInvite(this.token).pipe(
        switchMap(() => [preview])
      ))
    ).subscribe({
      next: (preview) => {
        this.snackbarService.showSnackBar('Has sido añadido al nuevo grupo', 'succes');
        this.router.navigate([`/group/${preview.groupId}`]);
      },
      error: (err) => {
        console.error('Error al aceptar la invitación:', err);
        this.snackbarService.showSnackBar(err?.error?.error ?? 'Parece que la url de invitación no es válida', 'error');
        this.router.navigate(['/']);
      },
    });
  }
}
