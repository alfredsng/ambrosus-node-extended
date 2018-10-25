export * from './datetime.helper';
export * from './mongo.helper';
export * from './request.helper';

export const matchHexOfLength = (text, length) =>
  new RegExp(`^0x[a-f0-9]{${length}}$`, 'gi').test(text);
