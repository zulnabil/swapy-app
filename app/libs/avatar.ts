export const Avatar = {
  generate: (text?: string) => {
    const seed = text || Math.random().toString(36).substring(7);
    const url = `https://api.dicebear.com/8.x/bottts/svg?seed=${seed}`;
    return url;
  },
};
