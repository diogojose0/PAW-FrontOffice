import { Component } from '@angular/core';

import { AuthRestServiceService } from '../../services/auth-rest-service.service';
import { PublicUser } from '../../models/auth.models';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  constructor(private authService: AuthRestServiceService) {}

  get currentUser(): PublicUser | null {
    return this.authService.getUser();
  }
}
