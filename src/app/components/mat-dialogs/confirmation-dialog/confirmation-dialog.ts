import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export type ConfirmationDialogData = {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
};

@Component({
  selector: 'app-confirmation-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './confirmation-dialog.html',
  styleUrl: './confirmation-dialog.scss'
})
export class ConfirmationDialog {
  private readonly _ref = inject<MatDialogRef<ConfirmationDialog, boolean>>(MatDialogRef);
  data = inject<ConfirmationDialogData>(MAT_DIALOG_DATA);

  onCancel() {
    this._ref.close(false);
  }

  onConfirm() {
    this._ref.close(true);
  }
}
