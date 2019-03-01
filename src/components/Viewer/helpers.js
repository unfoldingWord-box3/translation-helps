
export const deepFreeze = (object) => {
  Object.keys(object).forEach(key => {
    const value = object[key];
    if (value && typeof value === "object") deepFreeze(value);
  });
  return Object.freeze(object);
}
