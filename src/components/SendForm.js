import React from 'react';
import { connect } from 'react-redux';

import LeftIcon from './LeftIcon';
import ColorButton from './ColorButton';
import { sendBoulder } from '../actions';

const RawSendForm = ({ color, sector, sendBoulder }) => (
  <ColorButton color={color} onClick={() => sendBoulder(color, sector, { type: 'redpoint' })} className="mui-icon mui-icon-done">
    <LeftIcon icon="done" />Enchain&eacute;
  </ColorButton>
);

const mapStateToProps = state => ({
  color: state.ui.selectedColor,
  sector: state.ui.selectedSector,
});

const mapDispatchToProps = { sendBoulder };

export default connect(mapStateToProps, mapDispatchToProps)(RawSendForm);
