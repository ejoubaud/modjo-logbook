const palette = (main, light, dark, contrastText) => ({ main, light, dark, contrastText });

const colors = {
  yellow: {
    label: 'Jaune',
    palette: palette('#fdd835', '#ffff6b', '#c6a700', '#000000'),
  },
  green: {
    label: 'Vert',
    palette: palette('#388e3c', '#6abf69', '#00600f', '#ffffff'),
  },
  blue: {
    label: 'Bleu',
    palette: palette('#303f9f', '#666ad1', '#001970', '#ffffff'),
  },
  red: {
    label: 'Rouge',
    palette: palette('#d32f2f', '#ff6659', '#9a0007', '#ffffff'),
  },
  black: {
    label: 'Noir',
    palette: palette('#424242', '#6d6d6d', '#1b1b1b', '#ffffff'),
  },
  white: {
    label: 'Blanc',
    palette: palette('#bdbdbd', '#efefef', '#8d8d8d', '#000000'),
  },
  purple: {
    label: 'Violet',
    palette: palette('#ab47bc', '#df78ef', '#790e8b', '#ffffff'),
  },
};

export default colors;

const defaultColor = {
  label: 'Default',
  palette: palette('#9e9e9e', '#cfcfcf', '#707070', '#000000'),
};

export const getHue = (colorKey, hueName) => (colors[colorKey] || defaultColor).palette[hueName];
