import { Component, inject } from '@angular/core';
import { CharacterEditorComponent } from './components/character-editor/character-editor.component';
import { CharacterListComponent } from './components/character-list/character-list.component';
import { ComparisonPanelComponent } from './components/comparison-panel/comparison-panel.component';
import { Character } from './models/character.model';
import { CharacterService } from './services/character.service';

@Component({
  selector: 'sf3-root',
  standalone: true,
  imports: [
    CharacterEditorComponent,
    CharacterListComponent,
    ComparisonPanelComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly characterService = inject(CharacterService);
  editingCharacter: Character | null = null;
  selectionLimitReached = false;
  rosterOpen = false;

  toggleRoster(): void {
    this.rosterOpen = !this.rosterOpen;
  }

  closeRoster(): void {
    this.rosterOpen = false;
  }

  openRoster(): void {
    this.rosterOpen = true;
  }

  openEditor(character: Character): void {
    this.closeRoster();
    this.editingCharacter = character;
  }

  saveCharacter(character: Character): void {
    this.characterService.updateCharacter(character);
    this.editingCharacter = null;
  }

  toggleSelection(id: string): void {
    this.selectionLimitReached = !this.characterService.toggleSelection(id);
  }
}