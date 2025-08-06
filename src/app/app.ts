import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,MatButtonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'frontend';
}
