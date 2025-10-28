// main.js
import { model } from "./model.js";
import { view } from "./view.js";

function computeDisplayDate(value) {
  const selected = new Date(value);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);
  selected.setHours(0, 0, 0, 0);

  if (selected.getTime() === today.getTime()) return "Idag";
  if (selected.getTime() === tomorrow.getTime()) return "Imorgon";
  return value;
}

// ------- Controllers -------
function attachTaskListListeners(listName, taskListName, ul, addBtn, input, deleteBtn) {
  function handleCreateTask() {
    const name = input.value.trim();
    if (!name) { alert("Ange en uppgift"); return; }

    if (model.addTask(listName, taskListName, name)) {
      const node = view.renderTask(ul, taskListName, name);
      input.value = "";

      node.deleteBtn.addEventListener("click", () => {
        model.deleteTask(listName, taskListName, name);
        node.li.remove();
      });
    }
  }
  addBtn.addEventListener("click", handleCreateTask);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleCreateTask();
  });

  deleteBtn.addEventListener("click", () => {
    model.deleteTaskList(listName, taskListName);
    deleteBtn.closest(".taskListDiv").remove();
  });
}

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
    attachTaskListListeners(listName, taskList.name, ul, addBtn, input, deleteBtn);
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
      const obj = model.getLists();

      for (const key in obj) {
        if (input.value === key) {
          alert("Lista finns redan med samma namn");
          return;
        }
      };
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

    if (model.addTaskList(currentListName, taskListName, displayDate)) {
      const { ul, addBtn, input, deleteBtn } =
        view.renderTaskListDiv(taskListName, displayDate);

      attachTaskListListeners(currentListName, taskListName, ul, addBtn, input, deleteBtn);

      // reset form UI
      view.els.selectedList.value = "";
      view.els.dateInput.value = "";
      view.els.ls.classList.toggle("d-none");
    }
  }
}


// ------- App init & listeners -------
function init() {
  // console.log(view.els.clickable)
  // const {btn, input} = view.createBtn();
  // btn.addEventListener("click", ()=> view.colorChanger());
  // view.appendEls(btn);
  // view.appendEls(input);
  // view.els.clickable.addEventListener("click", ()=> view.colorChanger());
  model.ensureBootstrapped();
  view.resetInputs();

  // Sidebar toggling
  view.els.sidebarToggler.addEventListener("click", () => view.toggleSidebar());
  document.addEventListener("click", (e) => {
    // console.log(e.target)
    if (!view.els.sidebar.contains(e.target) && !view.els.navLink.contains(e.target)) {
      console.log(e.target);
      view.els.sidebar.classList.add("collapsed");

    }
  });

  view.els.createNewListBtn.addEventListener("click", () => { view.toggleSidebar(); });

  // Top buttons
  view.els.createNewListBtn.addEventListener("click", handleCreateNewList);
  view.els.closeListSettings.addEventListener("click", () => view.closeSettings());
  view.els.addTask.addEventListener("click", () => view.openTaskInput());


  // “Enter → date” flow
  view.els.selectedList.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (typeof view.els.selectedDate.showPicker === "function") view.els.selectedDate.showPicker();
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
  //object inbyggd funktion i js. Object.keys hämtar alla 
  //property namn i objektet "data" och visar upp dom som en array
  //detta kan uppvisas med: 
  console.log(Object.keys(data));
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