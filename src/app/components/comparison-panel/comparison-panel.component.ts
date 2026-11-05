import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Character, StatDefinition } from '../../models/character.model';
import {
  characterColor,
  portraitUrl,
  STAT_DEFINITIONS,
} from '../../utils/character.utils';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'sf3-comparison-panel',
  standalone: true,
  templateUrl: './comparison-panel.component.html',
  styleUrl: './comparison-panel.component.scss',
  imports: [MatIconModule]
})
export class ComparisonPanelComponent {
  @Input() characters: readonly Character[] = [];
  @Output() removeCharacter = new EventEmitter<string>();
  @Output() openCharacterList = new EventEmitter<void>();

  readonly stats: readonly StatDefinition[] = STAT_DEFINITIONS;
  unavailableImages = new Set<string>();

  colorFor(selectionOrder: number): string {
    return characterColor(selectionOrder);
  }

  get rowGap(): number {
    return Math.max(2, 10 - (this.characters.length - 1) * 2);
  }

  imageFor(portrait: string): string {
    return portraitUrl(portrait);
  }

  markImageUnavailable(id: string): void {
    this.unavailableImages = new Set(this.unavailableImages).add(id);
  }
}