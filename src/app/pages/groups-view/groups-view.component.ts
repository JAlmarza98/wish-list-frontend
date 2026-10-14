import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FooterComponent } from '@shared/footer/footer.component';
import { LoaderComponent } from '@shared/loader/loader.component';
import { MATERIAL_MODULES } from '@shared/material.module';
import { GroupsService } from 'src/app/services/groups.service';
import { LoaderService } from '@shared/loader/loader.service';
import { WishesService } from 'src/app/services/wishes.service';
import { List, Wish } from '@components/list/list.component';
import { TableAction, TableComponent } from '@shared/table/table.component';
import { catchError, of } from 'rxjs';
import { AuthService } from '@auth/auth.service';
import { InvitesService } from 'src/app/services/invites.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';
import { mapWish } from 'src/app/services/wish-mapper';

@Component({
  selector: 'app-groups-view',
  standalone: true,
  imports: [MATERIAL_MODULES, RouterModule, FooterComponent, LoaderComponent, TableComponent],
  templateUrl: './groups-view.component.html',
  styleUrl: './groups-view.component.css'
})
export class GroupsViewComponent implements OnInit {
  error!: string;
  groupID!: string;
  groupName = '';
  groupList: List[] = [];
  selectedIndex = 0;
  loadReady: boolean = false;
  me: string;
  reloadTable = false;
  isTableVisible: boolean;

  constructor(
    private groupsService: GroupsService,
    private wishesService: WishesService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private invitesService: InvitesService,
    private auth: AuthService,
    private router: Router,
    private clipboard: Clipboard,
    private snackbar: SnackbarService,
  ) {
    this.loaderService.ShowLoader();
    this.groupID = this.route.snapshot.paramMap.get('id') ?? '';
    this.me = this.auth.UserData!.id;
    this.isTableVisible = false;
  }

  ngOnInit(): void {
    this.fetchGroup();
  }

  fetchGroup(): void {
    this.groupsService.getGroupInfo(this.groupID).pipe(
      catchError(error => {
        console.error('Error al obtener información del grupo:', error);
        this.error = 'Ocurrió un error al cargar los datos del grupo.';
        return of(null);
      })
    ).subscribe(group => {
      this.loaderService.HideLoader();
      if (!group) {
        this.error = 'No eres miembro de este grupo.';
        return;
      }

      this.groupName = group.name;
      this.groupList = group.sharedLists
        .filter(list => list.ownerId !== this.me)
        .map(list => ({
          id: list.id,
          uid: list.ownerId,
          user: `${list.ownerUsername} - ${list.name}`,
          list: (list.wishes as any[]).map(mapWish),
        }));

      if (this.selectedIndex >= this.groupList.length) {
        this.selectedIndex = 0;
      }

      this.loadReady = true;
      this.reloadTable = true;
      this.isTableVisible = true;
    });
  }

  createInvitationLink(): void {
    this.invitesService.createInvite(this.groupID).subscribe(invite => {
      this.clipboard.copy(invite.url);
      this.snackbar.showSnackBar('El Link de invitación se te ha copiado en el porta papeles', 'succes');
    }, (err) => {
      console.log(err);
      this.snackbar.showSnackBar('No se ha podido crear la invitación', 'error');
    });
  }

  logOut(): void {
    this.auth.logOut().subscribe({
      next: () => this.router.navigateByUrl('/auth/login'),
      error: (error) => console.log(error),
    });
  }

  tableAction(event: TableAction): void {
    switch (event.action) {
      case 'reserve':
        this.isTableVisible = false;
        this.wishesService.reserve(event.row.id).subscribe(() => {
          this.snackbar.showSnackBar('Elemento reservado', 'succes');
          this.fetchGroup();
        }, (err) => {
          console.log(err);
          this.snackbar.showSnackBar(err?.error?.error ?? 'Error al reservar elemento', 'error');
          this.isTableVisible = true;
        });
        break;

      case 'remove':
        this.isTableVisible = false;
        this.wishesService.unreserve(event.row.id).subscribe(() => {
          this.snackbar.showSnackBar('Elemento dejado de reservar', 'succes');
          this.fetchGroup();
        }, (err) => {
          console.log(err);
          this.snackbar.showSnackBar('Error al dejar de reservar', 'error');
          this.isTableVisible = true;
        });
        break;
    }
  }
}
