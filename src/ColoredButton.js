import Button from 'muicss/lib/react/button';
import styled from 'styled-components';

const getCol = (name) => (props) => props.palette[name]

const raisedBase = `
  color: ${getCol('contrastText')};
  background-color: ${getCol('main')};
`

const RaisedButton = styled(Button)`
  ${raisedBase}
  color: ${getCol('contrastText')};
  background-color: ${getCol('main')};
  &:hover, &:focus, &:active {
    color: ${getCol('contrastText')};
    background-color: ${getCol('light')};
  }
  &[disabled] {
    &:hover, &:focus, &:active {
      ${raisedBase}
    }
  }
`

export default RaisedButton;
