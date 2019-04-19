import { Notyf } from "notyf";
import MicroModal from "micromodal";
import Notepad from "./model.js";
import { NOTE_ACTIONS } from "./utils/constants";
import {
  addListItem,
  renderNoteList,
  getRefs,
  findListItem,
  removeListItem
} from "./view.js";
import "notyf/notyf.min.css";

const refs = getRefs();
const notyf = new Notyf();
export const notepad = new Notepad();

notepad
  .getNotes()
  .then(notes => renderNoteList(refs.list, notes))
  .catch(error => {
    console.log(error);
    notyf.error("Ошибка! Повторите позже.");
  });

const handleFormSubmit = event => {
  event.preventDefault();

  const [title, body] = event.target.elements;
  const titleValue = title.value;
  const bodyValue = body.value;

  if ((titleValue.trim() && bodyValue.trim()) === "") {
    notyf.error("Необходимо заполнить все поля!");
    return;
  }
  notepad
    .saveNote(titleValue, bodyValue)
    .then(newNote => {
      addListItem(refs.list, newNote);
      notyf.success("Заметка успешно добавлена!");
      MicroModal.close("note-editor-modal");
    })
    .catch(error => {
      console.log(error);
      notyf.error("Ошибка! Повторите позже.");
    });
  event.currentTarget.reset();
  localStorage.removeItem("title-note");
  localStorage.removeItem("body-note");
};

const handleListClick = async event => {
  const target = event.target;
  if (target.nodeName !== "I") {
    return;
  }
  const button = target.closest(".action");
  const action = button.dataset.action;
  const listItem = findListItem(event.target);
  const listItemId = listItem.dataset.id;
  const note = await notepad.findNoteById(listItemId);
  const priorInc = note.priority + 1;
  const priorDec = note.priority - 1;

  switch (action) {
    case NOTE_ACTIONS.DELETE:
      notepad
        .deleteNote(listItemId)
        .then(notes => {
          console.log(notes);
          removeListItem(listItem);
          notyf.success("Заметка успешно удалена!");
        })
        .catch(error => {
          console.log(error);
          notyf.error("Ошибка! Повторите позже.");
        });
      break;

    case NOTE_ACTIONS.EDIT:
      MicroModal.show("note-update-modal");
      const noteItem = target.closest(".note");
      const [noteTitle, noteBody] = noteItem.firstElementChild.children;
      const title = document.querySelector("input.note-update__input");
      const body = document.querySelector("textarea.note-update__input");

      title.value = noteTitle.innerHTML;
      body.value = noteBody.innerHTML;

      localStorage.setItem("id-note", listItemId);

      break;
    case NOTE_ACTIONS.DECREASE_PRIORITY:
      if (note.priority === 0) return;

      const notes = await notepad.updateNotePriority(listItemId, {
        priority: priorDec
      });

      refs.list.innerHTML = "";
      await renderNoteList(refs.list, notes);
      break;
    case NOTE_ACTIONS.INCREASE_PRIORITY:
      if (note.priority === 2) return;

      const allnotes = await notepad.updateNotePriority(listItemId, {
        priority: priorInc
      });
      refs.list.innerHTML = "";
      renderNoteList(refs.list, allnotes);
      break;
    default:
      console.log("ошибка!");
      break;
  }
  return listItemId;
};

const handleUpdateFormSubmit = event => {
  event.preventDefault();
  const noteId = localStorage.getItem("id-note");
  const [title, body] = event.currentTarget.elements;

  notepad
    .updateNoteContent(noteId, { title: title.value, body: body.value })
    .then(notes => {
      refs.list.innerHTML = "";
      renderNoteList(refs.list, notes);
    });

  notyf.success("Изменения успешно сохранены!");
  MicroModal.close("note-update-modal");
  event.currentTarget.reset();
};

const handleFilterInput = event => {
  const value = event.target.value;
  notepad
    .filterNotesByQuery(value)
    .then(notes => {
      refs.list.innerHTML = "";
      renderNoteList(refs.list, notes);
    })
    .catch(error => {
      console.log(error);
      notyf.error("Ошибка! Повторите позже.");
    });
};

const handleOpenModal = () => {
  MicroModal.show("note-editor-modal");
};

const handleFormInput = event => {
  const [title, body] = event.currentTarget.elements;

  localStorage.setItem("title-note", title.value);
  localStorage.setItem("body-note", body.value);
};

const [title, body] = refs.editor.elements;

try {
  title.value = localStorage.getItem("title-note");
  body.value = localStorage.getItem("body-note");
} catch (error) {
  console.log(error);
}

refs.editor.addEventListener("submit", handleFormSubmit);
refs.editor.addEventListener("input", handleFormInput);
refs.update.addEventListener("submit", handleUpdateFormSubmit);
refs.searchForm.addEventListener("input", handleFilterInput);
refs.list.addEventListener("click", handleListClick);
refs.buttonOpenModal.addEventListener("click", handleOpenModal);
