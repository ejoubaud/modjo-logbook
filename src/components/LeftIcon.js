import React from 'react';
import styled from 'styled-components';

const Icon = ({ icon, className }) => (
  <i className={`material-icons ${className}`}>{icon}</i>
);

export default styled(Icon)`
  line-height: inherit;
  font-size: 1.3rem;
  margin-right: 10px;
  margin-left: -5px;
  float: left;
`;
