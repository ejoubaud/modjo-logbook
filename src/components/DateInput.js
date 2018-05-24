import React from 'react';
import Input from 'muicss/lib/react/input';
import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';

class DateInput extends React.Component {
  constructor(props) {
    super(props);
    this.tooltipRef = React.createRef();
  }

  componentDidUpdate() {
    ReactTooltip.rebuild();
    // TODO: This is not ideal, rework to show only when focused
    if (!this.tooltipRef.current.getAttribute('data-tip-disabled')) {
      ReactTooltip.show(this.tooltipRef.current);
    }
  }

  render() {
    const { name, date, handleChange, className, errorMsg } = this.props;
    return (
      <span
        ref={this.tooltipRef}
        data-tip={errorMsg || 'Date de la session'}
        data-type={errorMsg && 'error'}
      >
        <Input
          name={name}
          type="date"
          value={date}
          onChange={handleChange}
          className={className}
          invalid={!!errorMsg}
        />
      </span>
    );
  }
}

// override mui styles for a short-width button
const StyledDateInput = styled(DateInput)`
  display: inline-block;
  margin-right: 8px;
  input {
    width: 140px;
  }
`;

export default StyledDateInput;
