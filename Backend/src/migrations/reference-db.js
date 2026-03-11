import { readFile } from 'node:fs/promises';

const referenceDbUrl = new URL('../reference-data/author-blog-db.json', import.meta.url);

export const legacyRoleIdToKey = {
  0: 'admin',
  1: 'moder',
  2: 'reader',
  3: 'guest',
};

export const parseReferenceDate = (value, fallbackTime) => {
  if (typeof value !== 'string' || !value.trim()) {
    return new Date();
  }

  if (value.includes(' ')) {
    return new Date(value.replace(' ', 'T') + ':00.000Z');
  }

  return new Date(`${value}T${fallbackTime}.000Z`);
};

export const loadReferenceDb = async () => {
  try {
    const raw = await readFile(referenceDbUrl, 'utf-8');

    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`Failed to read reference db.json at ${referenceDbUrl.pathname}: ${error.message}`);
  }
};
