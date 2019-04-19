import { PRIORITY_TYPES, PRIORITIES } from "./utils/constants";
import { get, save, del, update } from "./api.js";

export default class Notepad {
  constructor(notes = []) {
    this.notes = notes;
  }

  async getNotes() {
    try {
      const notes = await get();
      this.notes = notes;
      return this.notes;
    } catch (error) {
      throw error;
    }
  }

  async findNoteById(id) {
    try {
      const notes = await get();
      const note = notes.find(note => note.id === id);
      return note;
    } catch (error) {
      throw error;
    }
  }

  async saveNote(title, body) {
    const note = {
      title: title,
      body: body,
      priority: PRIORITY_TYPES.LOW
    };
    try {
      const savedNote = await save(note);
      this.notes.push(savedNote);
      return savedNote;
    } catch (error) {
      throw error;
    }
  }

  async deleteNote(id) {
    try {
      del(id);
      this.notes = this.notes.filter(note => note.id !== id);
      return this.notes;
    } catch (error) {
      throw error;
    }
  }

  async updateNoteContent(id, updatedContent) {
    try {
      const note = await update(id, updatedContent);

      if (!note) return;
      const { title = note.title, body = note.body } = updatedContent;
      note.title = title;
      note.body = body;
      this.notes = this.notes.map(item => {
        if (item.id !== id) {
          return item;
        }
        return note;
      });
      return this.notes;
    } catch (error) {
      throw error;
    }
  }

  async updateNotePriority(id, data) {
    try {
      const note = await update(id, data);
      this.notes = this.notes.map(item => {
        if (item.id !== note.id) return item;
        return { ...note };
      });
      return this.notes;
    } catch (error) {
      throw error;
    }
  }

  async filterNotesByQuery(query) {
    try {
      const notes = await get();
      const filtredNotes = notes.filter(note =>
        (note.title + note.body).toLowerCase().includes(query.toLowerCase())
      );
      return filtredNotes;
    } catch (error) {
      throw error;
    }
  }

  async filterNotesByPriority(priority) {
    try {
      const notes = await get();
      const filtredNotes = notes.filter(note => note.priority === priority);
      return filtredNotes;
    } catch (error) {
      throw error;
    }
  }

  static getPriorityName(priorityId) {
    return PRIORITIES[priorityId].name;
  }
}
