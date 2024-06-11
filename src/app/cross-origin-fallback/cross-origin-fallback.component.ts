import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../app/auth/auth.service'

@Component({
  selector: 'inde-cross-origin-fallback',
  templateUrl: './cross-origin-fallback.component.html',
  styleUrls: ['./cross-origin-fallback.component.scss']
})
export class CrossOriginFallbackComponent implements OnInit {

  constructor(private authService: AuthService) { }

  public ngOnInit(): void {
  }

  public universalLogin(): void {
    this.authService.universalLogin();
  }

}
