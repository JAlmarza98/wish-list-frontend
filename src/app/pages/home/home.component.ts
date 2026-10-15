import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MATERIAL_MODULES } from '@shared/material.module';
import { FooterComponent } from '@shared/footer/footer.component';
import { ListComponent } from '@components/list/list.component';
import { GroupsComponent } from '@components/groups/groups.component';
import { LoaderComponent } from '@shared/loader/loader.component';
import { AuthService } from '@auth/auth.service';
import { ChangePasswordComponent } from '@auth/change-password/change-password.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MATERIAL_MODULES, FooterComponent, ListComponent, GroupsComponent, LoaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  activeTab: 'lists' | 'groups' = 'lists';

  get username(): string {
    return this.auth.UserData?.username ?? '';
  }

  get avatarInitial(): string {
    return this.username ? this.username.charAt(0).toUpperCase() : '?';
  }

  ngOnInit(): void {
    if (this.auth.UserData?.mustChangePassword) {
      this.openChangePassword(true);
    }
  }

  openChangePassword(mandatory = false): void {
    this.dialog.open(ChangePasswordComponent, {
      width: '420px',
      disableClose: mandatory,
      data: { mandatory },
    });
  }

  logOut(): void {
    this.auth.logOut().subscribe({
      next: () => this.router.navigateByUrl('/auth/login'),
      error: (error) => console.log(error),
    });
  }
}
