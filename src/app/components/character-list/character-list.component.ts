import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Character } from '../../models/character.model';
import { characterColor, portraitUrl } from '../../utils/character.utils';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'sf3-character-list',
  standalone: true,
  templateUrl: './character-list.component.html',
  styleUrl: './character-list.component.scss',
  imports: [MatIconModule]
})
export class CharacterListComponent {
  @Input({ required: true }) characters: readonly Character[] = [];
  @Input() selectedIds: readonly string[] = [];
  @Input() searchTerm = '';
  @Output() searchTermChange = new EventEmitter<string>();
  @Output() editCharacter = new EventEmitter<Character>();
  @Output() toggleSelection = new EventEmitter<string>();

  unavailableImages = new Set<string>();

  colorFor(id: string): string {
    const selectionOrder = this.selectedIds.indexOf(id);
    return selectionOrder === -1 ? '#596257' : characterColor(selectionOrder);
  }

  imageFor(portrait: string): string {
    return portraitUrl(portrait);
  }

  isSelected(id: string): boolean {
    return this.selectedIds.includes(id);
  }

  markImageUnavailable(id: string): void {
    this.unavailableImages = new Set(this.unavailableImages).add(id);
  }
}