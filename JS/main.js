// main.js
import { model } from "./model.js";
import { view } from "./view.js";

function computeDisplayDate(value) {
  const selected = new Date(value);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  today.setHours(0,0,0,0);
  tomorrow.setHours(0,0,0,0);
  selected.setHours(0,0,0,0);

  if (selected.getTime() === today.getTime()) return "Idag";
  if (selected.getTime() === tomorrow.getTime()) return "Imorgon";
  return value;
}

// ------- Controllers -------
function loadListToMain(listName) {
  const data = model.getLists();
  const selected = data[listName];
  if (!selected) return;

  view.clearMain();
  view.setCurrentListTitle(listName);

  Object.values(selected.taskLists).forEach(taskList => {
    const { ul, addBtn, input, deleteBtn } =
      view.renderTaskListDiv(taskList.name, taskList.date);

    // existing tasks
    Object.values(taskList.tasks || {}).forEach(t => {
      const node = view.renderTask(ul, taskList.name, t.name);
      node.input.addEventListener("keydown", e => {
        if (e.key === "Enter") node.input.blur();
      });
      node.deleteBtn.addEventListener("click", () => {
        model.deleteTask(listName, taskList.name, t.name);
        node.li.remove();
      });
    });

    // add new task
    addBtn.addEventListener("click", () => {
      const name = input.value.trim();
      if (!name) { alert("Ange en uppgift"); return; }
      if (model.addTask(listName, taskList.name, name)) {
        const node = view.renderTask(ul, taskList.name, name);
        input.value = "";
        node.deleteBtn.addEventListener("click", () => {
          model.deleteTask(listName, taskList.name, name);
          node.li.remove();
        });
      }
    });

    // delete task list
    deleteBtn.addEventListener("click", () => {
      model.deleteTaskList(listName, taskList.name);
      deleteBtn.closest(".taskListDiv").remove();
    });
  });
}

// function handleCreateNewList() {
//   // simple inline UI for entry
//   const name = prompt("Ange namn på lista");
//   if (!name?.trim()) { alert("Ange namn på lista"); return; }
//   const listName = name.trim();
//   model.addList(listName);
//   const { link, deleteBtn, li } = view.renderSidebarList(listName);

//   link.addEventListener("click", (e) => {
//     e.preventDefault();
//     loadListToMain(listName);
//   });

//   deleteBtn.addEventListener("click", () => {
//     const res = model.deleteList(listName);
//     if (!res.ok && res.reason === "only-one-left") {
//       alert("Kan ej radera om du bara har en lista kvar");
//       return;
//     }
//     li.remove();
//     view.clearMain();
//   });
// }

function handleCreateNewList() {
  // Be view skapa ett inputfält för ny lista
  const { li, input } = view.renderNewListInput();

  // Fokus på inputfältet
  input.focus();

  // När användaren trycker Enter
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const listName = input.value.trim();
      if (!listName) {
        view.showAlert("Ange namn på lista");
        return;
      }

      // Lägg till listan i modellen
      model.addList(listName);

      // Ta bort inputfältet och rendera den faktiska listan
      li.remove();
      const { link, deleteBtn, li: newLi } = view.renderSidebarList(listName);

      // Koppla klick för att visa listan i main
      link.addEventListener("click", (e) => {
        e.preventDefault();
        loadListToMain(listName);
      });

      // Koppla delete-knapp
      deleteBtn.addEventListener("click", () => {
        const res = model.deleteList(listName);
        if (!res.ok && res.reason === "only-one-left") {
          view.showAlert("Kan ej radera om du bara har en lista kvar");
          return;
        }
        newLi.remove();
        view.clearMain();
      });

      // Lås upp klick på resten av sidan igen
      view.unlockInteractions();
    }
  });

  // Om användaren klickar utanför → ta bort inputfältet
  input.addEventListener("blur", () => {
    li.remove();
    view.unlockInteractions();
  });
}




function createTaskList() {
  const { selectedList, dateInput, listNameH1 } = view.els;
  if (!dateInput.value) { alert("Ange datum"); return; }
  if (!selectedList.value.trim()) { alert("Ange uppgift"); return; }

  const displayDate = computeDisplayDate(dateInput.value);
  const taskListName = selectedList.value.trim();
  const currentListName = listNameH1.textContent || Object.keys(model.getLists())[0];

  if (model.addTaskList(currentListName, taskListName, displayDate)) {
    // render immediately in main
    const { ul, addBtn, input, deleteBtn } =
      view.renderTaskListDiv(taskListName, displayDate);

    addBtn.addEventListener("click", () => {
      const name = input.value.trim();
      if (!name) { alert("Ange en uppgift"); return; }
      if (model.addTask(currentListName, taskListName, name)) {
        const node = view.renderTask(ul, taskListName, name);
        input.value = "";
        node.deleteBtn.addEventListener("click", () => {
          model.deleteTask(currentListName, taskListName, name);
          node.li.remove();
        });
      }
    });

    deleteBtn.addEventListener("click", () => {
      model.deleteTaskList(currentListName, taskListName);
      deleteBtn.closest(".taskListDiv").remove();
    });

    // reset form UI
    view.els.selectedList.value = "";
    view.els.dateInput.value = "";
    view.els.ls.classList.toggle("d-none");
  }
}

// ------- App init & listeners -------
function init() {
  model.ensureBootstrapped();
  view.resetInputs();

  // Sidebar toggling
  view.els.sidebarToggler.addEventListener("click", () => view.toggleSidebar());
  document.addEventListener("click", (e) => {
    if (!view.els.sidebar.contains(e.target)) view.els.sidebar.classList.add("collapsed");
  });

  // Top buttons
  view.els.createNewListBtn.addEventListener("click", handleCreateNewList);
  view.els.closeListSettings.addEventListener("click", () => view.closeSettings());
  view.els.addTask.addEventListener("click", () => view.openTaskInput());


  // “Enter → date” flow
  view.els.selectedList.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (typeof view.els.selectedDate.showPicker === "function") view.els.selectedDate.showPicker();
      else view.els.selectedDate.focus();
    }
  });

  // date change
  view.els.selectedDate.addEventListener("change", (e) => {
    if (!view.els.selectedList.value.trim()) { alert("Ange namn på lista"); return; }
    if (!view.els.dateInput.value) { alert("Ange datum"); return; }
    createTaskList();
  });

  // “+” button in settings form
  view.els.addTaskBtn.addEventListener("click", createTaskList);

  // Load sidebar from storage
  const data = model.getLists();
  Object.keys(data).forEach(listName => {
    const { link, deleteBtn, li } = view.renderSidebarList(listName);

    link.addEventListener("click", (e) => {
      e.preventDefault();
      loadListToMain(listName);
    });

    deleteBtn.addEventListener("click", () => {
      const res = model.deleteList(listName);
      if (!res.ok && res.reason === "only-one-left") {
        alert("Kan ej radera om du bara har en lista kvar");
        return;
      }
      li.remove();
      view.clearMain();
    });
  });

  // Auto-load first list into main
  const first = Object.keys(data)[0];
  if (first) loadListToMain(first);
}

document.addEventListener("DOMContentLoaded", init);