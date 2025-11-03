// main.js
import { model } from "./model.js";
import { view } from "./view.js";

// ---- Utility function (same as before) ----
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

// 🔄 loadListToMain: now async, uses IDs and fetch calls
async function loadListToMain(listId) {
  const lists = await model.getLists();
  const selected = lists.find(l => l.id === listId);
  if (!selected) return;

  view.clearMain();
  view.setCurrentListTitle(selected.name);

  // Get all tasklists for this list from backend
  const taskLists = await model.getTaskLists(listId);
  for (const taskList of taskLists) {
    const { ul, addBtn, input, deleteBtn } =
      view.renderTaskListDiv(taskList.name, taskList.date);

    // Get tasks for this tasklist
    const tasks = await model.getTasks(taskList.id);
    for (const t of tasks) {
      const node = view.renderTask(ul, taskList.name, t.name);

      node.input.addEventListener("keydown", e => {
        if (e.key === "Enter") node.input.blur();
      });

      node.deleteBtn.addEventListener("click", async () => {
        await model.deleteTask(t.id);
        node.li.remove();
      });
    }

    // Add new task
    addBtn.addEventListener("click", async () => {
      const name = input.value.trim();
      if (!name) {
        alert("Ange en uppgift");
        return;
      }

      const newTask = await model.addTask(taskList.id, name);
      const node = view.renderTask(ul, taskList.name, newTask.name);
      input.value = "";

      node.deleteBtn.addEventListener("click", async () => {
        await model.deleteTask(newTask.id);
        node.li.remove();
      });
    });

    // Delete entire tasklist
    deleteBtn.addEventListener("click", async () => {
      await model.deleteTaskList(taskList.id);
      deleteBtn.closest(".taskListDiv").remove();
    });
  }
}

// 🔄 handleCreateNewList: now async and uses backend
async function handleCreateNewList() {
  const { li, input } = view.renderNewListInput();
  input.focus();

  input.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
      const name = input.value.trim();
      if (!name) {
        view.showAlert("Ange namn på lista");
        return;
      }

      // Create new list via backend
      await model.addList(name);

      li.remove();
      const { link, deleteBtn, li: newLi } = view.renderSidebarList(name);

      // Click → load list data
      link.addEventListener("click", (e) => {
        e.preventDefault();
        loadListToMainFromName(name);
      });

      // Delete → backend
      deleteBtn.addEventListener("click", async () => {
        const lists = await model.getLists();
        const list = lists.find(l => l.name === name);
        if (!list) return;
        await model.deleteList(list.id);
        newLi.remove();
        view.clearMain();
      });

      view.unlockInteractions();
    }
  });

  input.addEventListener("blur", () => {
    li.remove();
    view.unlockInteractions();
  });
}

// 🔄 helper for when we only have list name (sidebar click)
async function loadListToMainFromName(name) {
  const lists = await model.getLists();
  const selected = lists.find(l => l.name === name);
  if (selected) loadListToMain(selected.id);
}

// 🔄 createTaskList: now async, uses backend addTaskList()
async function createTaskList() {
  const { selectedList, dateInput, listNameH1 } = view.els;
  if (!dateInput.value) {
    alert("Ange datum");
    return;
  }
  if (!selectedList.value.trim()) {
    alert("Ange uppgift");
    return;
  }

  const displayDate = computeDisplayDate(dateInput.value);
  const taskListName = selectedList.value.trim();

  // Get current list info
  const lists = await model.getLists();
  const currentList = lists.find(l => l.name === listNameH1.textContent);
  if (!currentList) return;

  // Create on backend
  const newTaskList = await model.addTaskList(
    currentList.id,
    taskListName,
    displayDate
  );

  // Render in main view immediately
  const { ul, addBtn, input, deleteBtn } =
    view.renderTaskListDiv(taskListName, displayDate);

  addBtn.addEventListener("click", async () => {
    const name = input.value.trim();
    if (!name) {
      alert("Ange en uppgift");
      return;
    }
    const newTask = await model.addTask(newTaskList.id, name);
    const node = view.renderTask(ul, taskListName, newTask.name);
    input.value = "";

    node.deleteBtn.addEventListener("click", async () => {
      await model.deleteTask(newTask.id);
      node.li.remove();
    });
  });

  deleteBtn.addEventListener("click", async () => {
    await model.deleteTaskList(newTaskList.id);
    deleteBtn.closest(".taskListDiv").remove();
  });

  // Reset UI
  view.els.selectedList.value = "";
  view.els.dateInput.value = "";
  view.els.ls.classList.toggle("d-none");
}

// ------- App init & listeners -------
async function init() {
  view.resetInputs();

  // Sidebar toggling
  view.els.sidebarToggler.addEventListener("click", () => view.toggleSidebar());
  document.addEventListener("click", (e) => {
    if (
      !view.els.sidebar.contains(e.target) &&
      !view.els.navLink.contains(e.target)
    ) {
      view.els.sidebar.classList.add("collapsed");
    }
  });

  view.els.createNewListBtn.addEventListener("click", () => {
    view.toggleSidebar();
  });

  // Top buttons
  view.els.createNewListBtn.addEventListener("click", handleCreateNewList);
  view.els.closeListSettings.addEventListener("click", () => view.closeSettings());
  view.els.addTask.addEventListener("click", () => view.openTaskInput());

  // “Enter → date” flow
  view.els.selectedList.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (typeof view.els.selectedDate.showPicker === "function")
        view.els.selectedDate.showPicker();
      else view.els.selectedDate.focus();
    }
  });

  // date change
  view.els.selectedDate.addEventListener("change", async () => {
    if (!view.els.selectedList.value.trim()) {
      alert("Ange namn på lista");
      return;
    }
    if (!view.els.dateInput.value) {
      alert("Ange datum");
      return;
    }
    await createTaskList();
  });

  // “+” button in settings form
  view.els.addTaskBtn.addEventListener("click", createTaskList);

  // 🔄 Load sidebar from backend
  const lists = await model.getLists();
  for (const list of lists) {
    const { link, deleteBtn, li } = view.renderSidebarList(list.name);

    link.dataset.id = list.id;
    link.addEventListener("click", (e) => {
      e.preventDefault();
      loadListToMain(Number(link.dataset.id));
    });

    deleteBtn.addEventListener("click", async () => {
      await model.deleteList(list.id);
      li.remove();
      view.clearMain();
    });
  }

  // Auto-load first list into main
  if (lists.length > 0) loadListToMain(lists[0].id);
}

document.addEventListener("DOMContentLoaded", init);
