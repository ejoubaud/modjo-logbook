export const TOGGLE_COLOR = 'TOGGLE_COLOR';
export const TOGGLE_SECTOR = 'TOGGLE_SECTOR';
export const SEND_BOULDERS = 'SEND_BOULDERS';
export const CLEAR_BOULDERS = 'CLEAR_BOULDERS'; // not used anymore
export const CLEAR_SECTORS = 'CLEAR_SECTORS';
export const SYNC_SEND_MAP = 'SYNC_SEND_MAP';
export const SYNC_SEND_LIST = 'SYNC_SEND_LIST';
export const SHOW_ERROR = 'SHOW_ERROR';
export const HIDE_ERROR = 'HIDE_ERROR';
export const TOGGLE_LOADING = 'TOGGLE_LOADING';
export const ROLLBACK = 'ROLLBACK';

// saga actions
export const SUBMIT_SENDS = 'SUBMIT_SENDS';

export const toggleColor = color => ({
  type: TOGGLE_COLOR,
  payload: { color },
});

export const toggleSector = sectorId => ({
  type: TOGGLE_SECTOR,
  payload: { sectorId },
});

export const sendBoulders = sends => ({
  type: SEND_BOULDERS,
  payload: { sends },
});

// not used anymore (we clear sectors now, not just boulders)
export const clearBoulders = (color, sectors) => ({
  type: CLEAR_BOULDERS,
  payload: {
    color,
    sectors,
  },
});

export const clearSectors = sectors => ({
  type: CLEAR_SECTORS,
  payload: { sectors },
});

export const syncSendMap = sendMap => ({
  type: SYNC_SEND_MAP,
  payload: { sendMap },
});

export const syncSendList = sendList => ({
  type: SYNC_SEND_LIST,
  payload: { sendList },
});

export const rollback = ({ sendMap, sendList, error }) => ({
  type: ROLLBACK,
  payload: { previousSendMap: sendMap, previousSendList: sendList, error },
});

// ignoreId is optional
export const showError = (error, ignoreId) => ({
  type: SHOW_ERROR,
  payload: { error, ignoreId },
});

// ignoreId is optional, if passed this error won't be shown again
export const hideError = ignoreId => ({
  type: HIDE_ERROR,
  payload: { ignoreId },
});

export const toggleLoading = on => ({
  type: TOGGLE_LOADING,
  payload: { on },
});

// === SAGA ACTIONS ====

export const submitSends = type => ({
  type: SUBMIT_SENDS,
  payload: { type },
});
