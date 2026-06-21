import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  constructor(private snackBar: MatSnackBar) {

  }

  showSnackBar() {
    this.snackBar.open('This is a snack bar message!', 'Close', {
      duration: 3000, // Duration in milliseconds
    });
  }
}
