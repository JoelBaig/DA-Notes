import { Injectable, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { Firestore, collection, doc, onSnapshot } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class NoteListService {

  trashNotes: Note[] = [];
  normalNotes: Note[] = [];

  unsubTrash;

  firestore: Firestore = inject(Firestore);

  constructor() {
    this.unsubTrash = onSnapshot(this.getNotesRef(), (list) => {
      list.forEach(element => {
        console.log(this.setNoteObject(element.data(), element.id));
      });
    });
  }

  ngonDestroy() {
    this.unsubTrash();
  }

  subNotesList() {

  }

  subTrashList() {

  }

  setNoteObject(obj: any, id: string): Note {
    return {
      id: id || '',
      type: obj.type || 'note',
      title: obj.title || '',
      content: obj.content || '',
      marked: obj.marked || false,
    }
  }

  getNotesRef() {
    return collection(this.firestore, 'Notes');
  }

  getTrashRef() {
    return collection(this.firestore, 'trash');
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }
}
