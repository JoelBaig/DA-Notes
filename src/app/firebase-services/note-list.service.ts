import { Injectable, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { Firestore, collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class NoteListService {

  trashNotes: Note[] = [];
  normalNotes: Note[] = [];

  unsubNotes;
  unsubTrash;

  firestore: Firestore = inject(Firestore);

  constructor() {
    this.unsubNotes = this.subNotesList();
    this.unsubTrash = this.subTrashList();
  }

  async deleteNote(colId: 'notes' | 'trash', docId: string) {
    await deleteDoc(this.getSingleDocRef(colId, docId)).catch(
      (err) => { console.log(err) }
    );
  }

  async updateNote(note: Note) {
    let docRef = this.getSingleDocRef(this.getColIdFromNote(note), note.type);
    if (note.id) {
      await updateDoc(docRef, this.getCleanJson(note)).catch(
        (err) => { console.log(err); }
      );
    }
  }

  getCleanJson(note: Note): {} {
    return {
      type: note.type,
      title: note.title,
      content: note.content,
      marked: note.marked,
    }
  }

  getColIdFromNote(note: Note) {
    if (note.type == 'note') {
      return 'notes'
    } else {
      return 'trash'
    }
  }

  async addNote(item: Note, colId: 'notes' | 'trash') {
    console.log("Speichere Notiz in:", colId, "mit Inhalt:", item);
    if (item.type === 'trash') {
      colId = 'trash';
      this.trashNotes.push(item);
    } else if (item.type === 'note') {
      colId = 'notes';
      this.normalNotes.push(item);
    }

    await addDoc(this.getNotesRef(), item).catch(
      (err) => { console.error(err) }
    ).then(
      (docRef) => { console.log("Document written with ID: ", docRef?.id); }
    )
  }

  // async addNote(item: Note, colId: 'notes' | 'trash') {
  //   if (item.type == 'trash') {
  //     colId = 'trash';
  //   } else {
  //     colId = 'notes';
  //   }

  //   await addDoc(collection(this.firestore, colId), item)
  //     .then((docRef) => {
  //       console.log("Document written with ID:", docRef.id);
  //     })
  //     .catch((err) => {
  //       console.error("Fehler beim Hinzufügen der Notiz:", err);
  //     });
  // }

  ngonDestroy() {
    this.unsubNotes();
    this.unsubTrash();
  }

  subNotesList() {
    return onSnapshot(this.getNotesRef(), (list) => {
      console.log("Aktualisierte Notizen aus Firestore:", list.docs.map(doc => doc.data()));

      this.normalNotes = [];
      list.forEach(element => {
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));
      });
    });
  }

  subTrashList() {
    return onSnapshot(this.getTrashRef(), (list) => {
      console.log("Aktualisierte Trash-Notizen aus Firestore:", list.docs.map(doc => doc.data()));

      this.trashNotes = [];
      list.forEach(element => {
        this.trashNotes.push(this.setNoteObject(element.data(), element.id));
      });
    });
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
    return collection(this.firestore, 'notes');
  }

  getTrashRef() {
    return collection(this.firestore, 'trash');
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }
}
