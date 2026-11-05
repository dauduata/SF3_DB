import { Character, CharacterStats, StatKey } from '../models/character.model';

export const STAT_DEFINITIONS: readonly {
  key: StatKey;
  code: string;
  label: string;
  icon: string;
}[] = [
  { key: 'strength', code: 'A', label: 'Strength', icon: 'bolt' },
  { key: 'intelligence', code: 'B', label: 'Intelligence', icon: 'psychology' },
  { key: 'charm', code: 'C', label: 'Charm', icon: 'favorite' },
  { key: 'diplomacy', code: 'D', label: 'Diplomacy', icon: 'handshake' },
  { key: 'loyalty', code: 'E', label: 'Loyalty', icon: 'security' },
];

export const CHARACTER_COLORS = [
  '#B48EFA', // Purple
  '#55C7C0', // Turquoise
  '#FFB84D', // Orange
  '#9BCB62', // Lime Green
  '#F28BA8', // Pink
  '#65A9F5', // Sky Blue
  '#F18D65', // Coral
  '#63C995', // Mint Green
  '#DC82D2', // Orchid
  '#E5C653', // Yellow
] as const;

export function normalizeStat(value: unknown): number {
  if (value === null || value === undefined) {
    return 0;
  }

  if (typeof value !== 'number' || !Number.isInteger(value)) {
    return 0;
  }

  return Math.min(10, Math.max(0, value));
}

export function normalizeStats(value: unknown): CharacterStats {
  const stats = isRecord(value) ? value : {};

  return {
    strength: normalizeStat(stats['strength']),
    intelligence: normalizeStat(stats['intelligence']),
    charm: normalizeStat(stats['charm']),
    diplomacy: normalizeStat(stats['diplomacy']),
    loyalty: normalizeStat(stats['loyalty']),
  };
}

export function characterColor(selectionOrder: number): string {
  const colorIndex = Math.abs(selectionOrder) % CHARACTER_COLORS.length;
  return CHARACTER_COLORS[colorIndex];
}

export function portraitUrl(portrait: string): string {
  const normalizedPath = portrait.replace(/^\/+/, '').replace(/^\.\.\//, '');
  return normalizedPath ? `/assets/${normalizedPath}` : '';
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function sourceCharacter(
  value: unknown,
  index: number,
  countryNames: ReadonlyMap<string, string>,
): Character | null {
  if (!isRecord(value)) {
    return null;
  }

  const countryId = readText(value['country_id_hex'], '00');
  const sourceId = readText(value['id_hex'], index.toString(16).padStart(2, '0'));
  const id = `${countryId}-${sourceId}`;
  const skill = isRecord(value['special_skill']) ? value['special_skill'] : {};

  return {
    id,
    countryId,
    countryName: countryNames.get(countryId) ?? '',
    sourceId,
    nameEnglish: readText(value['name_english'], `Character ${id}`),
    nameJapanese: readText(value['name_japanese'], ''),
    portrait: readText(value['portrait'], ''),
    specialSkill: {
      nameEnglish: readText(skill['name_english'], ''),
      nameJapanese: readText(skill['name_japanese'], ''),
    },
    stats: normalizeStats(value['stats']),
  };
}

function readText(value: unknown, fallback: string): string {
  return typeof value === 'string' ? value : fallback;
}