import listItem from "../tamplate/list-item.hbs";
import Notepad from "./model.js";

export const getRefs = () => ({
  list: document.querySelector(".note-list"),
  editor: document.querySelector(".note-editor"),
  update: document.querySelector(".note-update"),
  searchForm: document.querySelector(".search-form"),
  buttonOpenModal: document.querySelector('[data-action="open-editor"]')
});

export const createListItem = note => {
  const newNote = {
    ...note,
    priority: `Priority: ${Notepad.getPriorityName(note.priority)}`
  };
  return listItem(newNote);
};

export const renderNoteList = (list, data) => {
  const items = data.map(item => createListItem(item)).join("");

  return list.insertAdjacentHTML("beforeend", items);
};

export const findListItem = child => {
  const parent = child.closest(".note-list__item");

  return parent;
};

export const removeListItem = item => item.remove();

export const addListItem = (list, note) => {
  const listItem = createListItem(note);
  return list.insertAdjacentHTML("beforeEnd", listItem);
};
