// Represents a send, i.e. a user sending a specific boulder
// (color/sector pair) with a certain type (flash/redpoint)
// or a clear (clearing a sector that's been reopened/unmounted)
import map from 'lodash/fp/map';
import nanoid from 'nanoid';

export const generateSendId = () => nanoid(10);

export const createSend = ({
  color,
  sectorId,
  type,
  createdAt,
  userId,
  funRating,
  difficultyRating,
  id,
}) => ({
  id: id || generateSendId(),
  userId,
  sectorId,
  type,
  createdAt: createdAt || new Date(),
  ...(color ? { color } : {}),
  ...(funRating ? { funRating } : {}),
  ...(difficultyRating ? { difficultyRating } : {}),
});

export const createSends = ({
  color,
  sectorIds,
  type,
  funRating,
  difficultyRating,
  userId,
}) => (
  map(
    sectorId => (
      createSend({
        color,
        sectorId,
        type,
        funRating,
        difficultyRating,
        userId,
      })
    ),
    sectorIds,
  )
);

export const isClear = send => send.type === 'clear';
