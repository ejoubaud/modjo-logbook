import React from 'react';

import SendButton from './SendButton';
import ClearButton from './ClearButton';

const BoulderForm = () => (
  <div>
    <SendButton label="Encha&icirc;n&eacute;" icon="done" sendType="redpoint" />
    <SendButton label="Flash&eacute;" icon="flash_on" sendType="flash" />
    <ClearButton label="D&eacute;mont&eacute;" icon="refresh" />
  </div>
);

export default BoulderForm;
