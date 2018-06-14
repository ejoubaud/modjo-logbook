import nanoid from 'nanoid';

export const generateLoadingId = (sagaName) => `submitClears${nanoid()}`;
