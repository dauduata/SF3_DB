import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Character, StatDefinition, StatKey } from '../../models/character.model';
import { portraitUrl, STAT_DEFINITIONS } from '../../utils/character.utils';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'sf3-character-editor',
  standalone: true,
  imports: [FormsModule, MatIconModule],
  templateUrl: './character-editor.component.html',
  styleUrl: './character-editor.component.scss',
})
export class CharacterEditorComponent implements OnChanges {
  @Input() character: Character | null = null;
  @Output() saveCharacter = new EventEmitter<Character>();
  @Output() closeEditor = new EventEmitter<void>();

  draft: Character | null = null;
  readonly stats: readonly StatDefinition[] = STAT_DEFINITIONS;
  readonly segments = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  unavailableImages = new Set<string>();

  ngOnChanges(): void {
    this.draft = this.character
      ? {
          ...this.character,
          specialSkill: { ...this.character.specialSkill },
          stats: { ...this.character.stats },
        }
      : null;
  }

  isDraftValid(): boolean {
    if (!this.draft?.nameEnglish.trim()) {
      return false;
    }

    return this.stats.every(({ key }) => {
      const value = this.draft?.stats[key];
      return Number.isInteger(value) && value !== undefined && value >= 0 && value <= 10;
    });
  }

  setStat(key: StatKey, value: number): void {
    if (this.draft) {
      if (this.draft.stats[key] == value) {
        this.draft.stats[key] = 0;
      } else {
        this.draft.stats[key] = value;
      }
    }
  }

  imageFor(portrait: string): string {
    return portraitUrl(portrait);
  }

  markImageUnavailable(id: string): void {
    this.unavailableImages = new Set(this.unavailableImages).add(id);
  }

  save(form: NgForm): void {
    if (form.invalid || !this.draft || !this.isDraftValid()) {
      return;
    }

    this.saveCharacter.emit(this.draft);
  }
}