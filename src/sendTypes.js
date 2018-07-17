const sendTypes = {
  redpoint: {
    abbrev: 'r',
    description: 'Enchaîné',
  },
  flash: {
    abbrev: 'f',
    description: 'Flashé',
  },
  clear: {
    abbrev: 'c',
    description: 'Démonté',
  },
};

export default sendTypes;

export const getDescription = key => (sendTypes[key] ? sendTypes[key].description : '');
