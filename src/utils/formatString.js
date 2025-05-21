export const formatString = (name, limit = 12) => {
  return name.length > limit ? `${name.substring(0, limit)}...` : name;
};
