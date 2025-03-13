import { Component, Output, EventEmitter } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { NoteListService } from '../firebase-services/note-list.service'
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-note-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-note-dialog.component.html',
  styleUrl: './add-note-dialog.component.scss'
})
export class AddNoteDialogComponent {
  @Output() addDialogClosed: EventEmitter<boolean> = new EventEmitter();
  title = "";
  description = "";

  constructor(private noteService: NoteListService){}

  closeDialog() {
    this.title = "";
    this.description = "";
    this.addDialogClosed.emit(false);
  }

  addNote() {
    console.log("📌 addNote() in AddNoteDialogComponent aufgerufen mit Titel:", this.title, "und Beschreibung:", this.description);

    if (!this.title.trim() || !this.description.trim()) {
      console.error("❌ Fehler: Titel oder Beschreibung fehlt!");
      return;
    }

    // Erstelle eine neue Notiz basierend auf der Eingabe
    const newNote: Note = {
      title: this.title,
      content: this.description,
      marked: false,
      type: 'note', // Standardmäßig wird die Notiz in "notes" gespeichert
    };

    // Aufruf der `addNote()`-Methode in `NoteListService`
    this.noteService.addNote(newNote, 'notes');

    // Dialog schließen
    this.closeDialog();
  }
}

