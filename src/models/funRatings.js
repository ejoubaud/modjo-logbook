import map from 'lodash/fp/map';
import toPairs from 'lodash/fp/toPairs';
import compose from 'lodash/fp/compose';

const add = (emoji, description) => ({ emoji, description });

const byValue = {
  0: add('😕', 'Bof'),
  1: add('😀', 'Cool'),
  3: add('😍', 'Génial'),
};

export default compose(
  map(([value, { emoji, description }]) => ({ value, emoji, description })),
  toPairs,
)(byValue);

export const getByValue = (value) => {
  const conf = byValue[value];
  return conf && { ...conf, value };
};

export const getDescription = (value) => {
  const conf = getByValue(value);
  return conf ? conf.description : '';
};
