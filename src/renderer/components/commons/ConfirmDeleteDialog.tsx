import { Button, Dialog, DialogActions, DialogTitle } from '@material-ui/core';
import React from 'react';

interface ConfirmDeleteDialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmDeleteDialog = (
  props: ConfirmDeleteDialogProps,
): React.ReactElement => {
  const { open, title, onClose, onConfirm } = props;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogActions>
        <Button onClick={onClose} color="default">
          Quay lại
        </Button>
        <Button onClick={onConfirm} color="secondary">
          Xóa
        </Button>
      </DialogActions>
    </Dialog>
  );
};
