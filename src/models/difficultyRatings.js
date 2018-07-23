import map from 'lodash/fp/map';
import toPairs from 'lodash/fp/toPairs';
import sortBy from 'lodash/fp/sortBy';
import compose from 'lodash/fp/compose';

const add = (emoji, description) => ({ emoji, description });

const byValue = {
  '-2': add('👇', 'Surcoté'),
  '-1': add('😏', 'Facile pour sa couleur'),
  0: add('👌', 'Difficulté typique de sa couleur'),
  1: add('😣', 'Difficile pour sa couleur'),
  2: add('☝️', 'Sous-coté'),
};

export default compose(
  sortBy(conf => parseInt(conf.value, 10)),
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
