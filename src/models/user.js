export const getDisplayName = user => user.displayNameOverride || user.displayName;

export const mockUser = {
  uid: 'guest',
  displayName: 'Toi',
  photoURL: 'https://www.gravatar.com/avatar', // Gravatar default avatar is as good as any
};
