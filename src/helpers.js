import localstorage from 'local-storage';

export const save = ({key, value}) => {
 return localstorage.set(key, value);
};

export const load = ({key, defaultValue}) => {
  let value;
  try {
    value = localstorage.get(key);
  } catch {
    value = defaultValue;
  }
  return value || defaultValue;
};

export const deepFreeze = (object) => {
  Object.keys(object).forEach(key => {
    const value = object[key];
    if (value && typeof value === "object") deepFreeze(value);
  });
  return Object.freeze(object);
}
