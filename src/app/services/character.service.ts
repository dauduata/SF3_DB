import { computed, Injectable, signal } from '@angular/core';
import sourceData from '../../../data/sf3_data.json';
import {
  Character,
  CharacterEdits,
} from '../models/character.model';
import { isRecord, sourceCharacter } from '../utils/character.utils';

const EDIT_STORAGE_KEY = 'sf3-character-editor-v1';
const MAX_SELECTED_CHARACTERS = 5;

@Injectable({ providedIn: 'root' })
export class CharacterService {
  private readonly sourceCharacters = this.loadSourceCharacters();
  private readonly edits = signal(this.loadEdits());

  readonly characters = computed(() =>
    this.sourceCharacters.map((character) => ({
      ...character,
      ...this.edits()[character.id],
      specialSkill:
        this.edits()[character.id]?.specialSkill ?? character.specialSkill,
      stats: this.edits()[character.id]?.stats ?? character.stats,
    })),
  );
  readonly selectedIds = signal<readonly string[]>([]);
  readonly searchTerm = signal('');
  readonly visibleCharacters = computed(() => {
    const characters = this.characters();
    const query = this.searchTerm().trim().toLocaleLowerCase();

    if (!query) {
      return characters;
    }

    const matches: Character[] = [];
    const remaining: Character[] = [];
    for (const character of characters) {
      const searchableName = `${character.nameEnglish} ${character.nameJapanese}`
        .toLocaleLowerCase();
      (searchableName.includes(query) ? matches : remaining).push(character);
    }

    return [...matches, ...remaining];
  });
  readonly selectedCharacters = computed(() => {
    const charactersById = new Map(
      this.characters().map((character) => [character.id, character]),
    );

    return this.selectedIds()
      .map((id) => charactersById.get(id))
      .filter((character): character is Character => character !== undefined);
  });

  toggleSelection(id: string): boolean {
    const selectedIds = this.selectedIds();
    if (selectedIds.includes(id)) {
      this.selectedIds.set(selectedIds.filter((selectedId) => selectedId !== id));
      return true;
    }

    if (selectedIds.length >= MAX_SELECTED_CHARACTERS) {
      return false;
    }

    this.selectedIds.set([...selectedIds, id]);
    return true;
  }

  removeSelection(id: string): void {
    this.selectedIds.update((ids) => ids.filter((selectedId) => selectedId !== id));
  }

  updateCharacter(character: Character): void {
    const { id, nameEnglish, nameJapanese, specialSkill, stats } = character;
    const updatedEdits: Record<string, CharacterEdits> = {
      ...this.edits(),
      [id]: {
        nameEnglish: nameEnglish.trim(),
        nameJapanese: nameJapanese.trim(),
        specialSkill: { ...specialSkill },
        stats: { ...stats },
      },
    };

    this.edits.set(updatedEdits);
    this.persistEdits(updatedEdits);
  }

  private loadSourceCharacters(): Character[] {
    const dataset = sourceData as { characters?: unknown; countries?: unknown };
    if (!Array.isArray(dataset.characters)) {
      return [];
    }

    const countryNames = new Map<string, string>();
    if (Array.isArray(dataset.countries)) {
      for (const country of dataset.countries) {
        if (
          isRecord(country) &&
          typeof country['id_hex'] === 'string' &&
          typeof country['name_english'] === 'string'
        ) {
          countryNames.set(country['id_hex'], country['name_english']);
        }
      }
    }

    return dataset.characters
      .map((character, index) => sourceCharacter(character, index, countryNames))
      .filter((character): character is Character => character !== null);
  }

  private loadEdits(): Record<string, CharacterEdits> {
    try {
      const storedValue = localStorage.getItem(EDIT_STORAGE_KEY);
      if (!storedValue) {
        return {};
      }

      const parsed: unknown = JSON.parse(storedValue);
      if (!isRecord(parsed)) {
        return {};
      }

      const knownIds = new Set(this.sourceCharacters.map(({ id }) => id));
      return Object.fromEntries(
        Object.entries(parsed).flatMap(([id, edit]) => {
          if (!knownIds.has(id) || !isRecord(edit)) {
            return [];
          }

          const base = this.sourceCharacters.find((character) => character.id === id);
          if (!base) {
            return [];
          }

          return [[id, this.sanitizeEdit(edit, base)]];
        }),
      );
    } catch {
      return {};
    }
  }

  private sanitizeEdit(edit: Record<string, unknown>, base: Character): CharacterEdits {
    const skill = isRecord(edit['specialSkill']) ? edit['specialSkill'] : {};
    const stats = isRecord(edit['stats']) ? edit['stats'] : {};

    return {
      nameEnglish:
        typeof edit['nameEnglish'] === 'string' ? edit['nameEnglish'] : base.nameEnglish,
      nameJapanese:
        typeof edit['nameJapanese'] === 'string' ? edit['nameJapanese'] : base.nameJapanese,
      specialSkill: {
        nameEnglish:
          typeof skill['nameEnglish'] === 'string'
            ? skill['nameEnglish']
            : base.specialSkill.nameEnglish,
        nameJapanese:
          typeof skill['nameJapanese'] === 'string'
            ? skill['nameJapanese']
            : base.specialSkill.nameJapanese,
      },
      stats: {
        strength: sanitizeEditedStat(stats['strength'], base.stats.strength),
        intelligence: sanitizeEditedStat(stats['intelligence'], base.stats.intelligence),
        charm: sanitizeEditedStat(stats['charm'], base.stats.charm),
        diplomacy: sanitizeEditedStat(stats['diplomacy'], base.stats.diplomacy),
        loyalty: sanitizeEditedStat(stats['loyalty'], base.stats.loyalty),
      },
    };
  }

  private persistEdits(edits: Record<string, CharacterEdits>): void {
    try {
      localStorage.setItem(EDIT_STORAGE_KEY, JSON.stringify(edits));
    } catch {
      // Keep the in-memory edit if browser storage is unavailable.
    }
  }
}

function sanitizeEditedStat(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 10
    ? value
    : fallback;
}