import React from 'react';
import { connect } from 'react-redux';

import ColorButton from './ColorButton';
import { sendBoulder } from '../actions';

const RawSendForm = ({ color, sector, sendBoulder }) => (
  console.log('sendForm', color, sector, sendBoulder) ||
  <ColorButton color={color} onClick={() => sendBoulder(color, sector, { type: 'redpoint' })}>
    <i className="material-icons">done</i>Enchain&eacute;
  </ColorButton>
);

const mapStateToProps = state => ({
  color: state.ui.selectedColor,
  sector: state.ui.selectedSector,
});

const mapDispatchToProps = { sendBoulder };

const SendForm = connect(mapStateToProps, mapDispatchToProps)(RawSendForm);

const BoulderForm = ({ color, sector }) => {
  console.log(color, sector);
  if (color && sector) return <SendForm />;
  return null;
};

export default connect(
  state => ({ color: state.ui.selectedColor, sector: state.ui.selectedSector }),
)(BoulderForm);
