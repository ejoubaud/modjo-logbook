import React from 'react';
import { connect } from 'react-redux';

import LeftIcon from './LeftIcon';
import ColorButton from './ColorButton';
import { clearBoulders } from '../actions';

const tooltipContent = (color, sectors) => {
  if (!color) return "Sélectionner une couleur d'abord";
  if (sectors.length === 0) return "Sélectionner des secteurs d'abord";
  return "Indiquer qu'un bloc a été démonté ou réouvert depuis la dernière fois où vous l'avez enchaîné.<br />Vous pourrez ensuite noter un passage du nouveau bloc.";
};

const onClick = ({ canClear, color, sectors, clearBoulders }) => (
  (e) => {
    e.preventDefault();
    if (canClear) clearBoulders(color, sectors);
  }
);

const RawClearButton = ({ label, icon, color, sectors, canClear, clearBoulders }) => (
  <ColorButton
    color={color}
    className={canClear || 'mui--is-disabled'}
    onClick={onClick({ canClear, color, sectors, clearBoulders })}
    data-tip={tooltipContent(color, sectors)}
    data-html
  >
    <LeftIcon icon={icon} />{label}
  </ColorButton>
);

const mapStateToProps = (state) => {
  const color = state.ui.selectedColor;
  const sectors = state.ui.selectedSectors;
  return {
    color,
    sectors,
    canClear: !!color && sectors.length > 0,
  };
};

const mapDispatchToProps = { clearBoulders };

export default connect(mapStateToProps, mapDispatchToProps)(RawClearButton);
