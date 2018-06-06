// Represents a send, i.e. a user sending a specific boulder
// (color/sector pair) with a certain type (flash/redpoint)
import map from 'lodash/fp/map';
import nanoid from 'nanoid';

export const generateSendId = () => nanoid(9);

export const createSend = ({ color, sectorId, type, createdAt, userId, id }) => ({
  id: id || generateSendId(),
  userId,
  color,
  sectorId,
  type,
  createdAt: createdAt || new Date(),
});

export const createSends = ({ color, sectorIds, type, userId }) => (
  map(sectorId => createSend({ color, sectorId, type, userId }), sectorIds)
);
