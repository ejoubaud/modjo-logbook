import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const ConfirmDialog = ({ isOpen, onConfirm, toggleConfirm }) => (
  <Dialog
    open={isOpen}
    onClose={() => toggleConfirm(false)}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle id="alert-dialog-title">
      Toutes les couleurs seront d&eacute;mont&eacute;es
    </DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        Le d&eacute;montage concerne un secteur entier, pas seulement cette couleur.
        Les blocs de toutes les couleurs seront marqu&eacute;es comme d&eacute;mont&eacute;s
        pour les secteurs s&eacute;lectionn&eacute;s. Continuer&nbsp;?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={() => toggleConfirm(false)} color="primary">
        Annuler
      </Button>
      <Button
        onClick={() => { toggleConfirm(false); onConfirm(); }}
        color="primary"
        autoFocus
      >
        OK
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDialog;
