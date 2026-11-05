export interface CharacterStats {
  strength: number;
  intelligence: number;
  charm: number;
  diplomacy: number;
  loyalty: number;
}

export type StatKey = keyof CharacterStats;

export interface SpecialSkill {
  nameEnglish: string;
  nameJapanese: string;
}

export interface Character {
  id: string;
  countryId: string;
  countryName: string;
  sourceId: string;
  nameEnglish: string;
  nameJapanese: string;
  portrait: string;
  specialSkill: SpecialSkill;
  stats: CharacterStats;
}

export type CharacterEdits = Pick<
  Character,
  'nameEnglish' | 'nameJapanese' | 'specialSkill' | 'stats'
>;

export interface StatDefinition {
  key: StatKey;
  code: string;
  label: string;
  icon: string;
}