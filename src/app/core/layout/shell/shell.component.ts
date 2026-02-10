import { Component, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../auth/auth.service';


@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    CommonModule, AsyncPipe,
    RouterOutlet, RouterLink, RouterLinkActive,
    MatSidenavModule, MatToolbarModule, MatListModule, MatIconModule, MatButtonModule
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})


export class ShellComponent {
  private breakpointObserver = inject(BreakpointObserver);

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(r => r.matches),
    shareReplay(1)
  );

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
