import React from 'react';
import { connect } from 'react-redux';

import SendForm from './SendForm.js';

const BoulderForm = ({ color, sector }) => {
  console.log(color, sector);
  if (color && sector) return <SendForm />;
  return null;
};

export default connect(
  state => ({ color: state.ui.selectedColor, sector: state.ui.selectedSector }),
)(BoulderForm);
