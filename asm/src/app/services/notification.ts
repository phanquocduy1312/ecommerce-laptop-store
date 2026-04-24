import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  
  constructor(private snackBar: MatSnackBar) {}

  success(message: string, duration: number = 3001) {
    this.snackBar.open(message, '✓', {
      duration: duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  error(message: string, duration: number = 3001) {
    this.snackBar.open(message, '✕', {
      duration: duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }

  info(message: string, duration: number = 3001) {
    this.snackBar.open(message, 'OK', {
      duration: duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['info-snackbar']
    });
  }

  warning(message: string, duration: number = 3001) {
    this.snackBar.open(message, '⚠', {
      duration: duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['warning-snackbar']
    });
  }
}
