// view.js
export const view = {
  els: {
    ls: document.querySelector(".listSettings"),
    addTask: document.querySelector(".addtask"),
    addTaskBtn: document.querySelector(".addTaskBtn"),
    closeListSettings: document.querySelector(".closeListSettings"),
    sidebar: document.querySelector(".sidebar"),
    navList: document.querySelector(".nav-list"),
    selectedList: document.getElementById("listNameID"),
    selectedDate: document.getElementById("dateID"),
    createNewListBtn: document.querySelector(".createNewListBtn"),
    listNameH1: document.querySelector(".listname"),
    listContainer: document.querySelector(".list-container"),
    dateInput: document.querySelector("#dateID"),
    sidebarToggler: document.querySelector(".sidebar-toggler"),
    testing: document.querySelector(".testing"),
    clickable: document.querySelector(".clickable"),
  },


  // colorChanger(){
  //   console.log("Color changer");
  //   const {clickable } = this.els;
  //   if(clickable.style.background !== "red"){
  //     clickable.style.background ="red";
  //   } else{
  //     clickable.style.background ="blue";
  //   }
    
  // },

  // createBtn(){
  //   const btn = document.createElement("button");
  //   btn.classList.add("clickable");
  //   const input = document.createElement("input");
  //   input.type = "text";
  //   input.placeholder = "Click me to change color";
  //   btn.appendChild(input);
  //   document.body.appendChild(btn);
  //   return {btn, input};
  // },

  // appendEls(element){
  //   this.els.testing.appendChild(element);
  // },

  resetInputs() {
    const { selectedList, selectedDate } = this.els;
    if (selectedList) selectedList.value = "";
    if (selectedDate) selectedDate.value = "";
  },

  // Sidebar item
  renderSidebarList(listName) {
    const li = document.createElement("li");
    li.classList.add("nav-item");

    const a = document.createElement("a");
    a.href = "#";
    a.classList.add("nav-link");

    const icon = document.createElement("span");
    icon.classList.add("material-symbols-outlined");
    icon.textContent = "dashboard";

    const label = document.createElement("span");
    label.classList.add("nav-label");
    label.textContent = listName;

    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.classList.add("deleteListBtn");
    const delIcon = document.createElement("span");
    delIcon.classList.add("material-symbols-outlined");
    delIcon.textContent = "close";
    delBtn.appendChild(delIcon);

    a.appendChild(icon);
    a.appendChild(label);
    li.appendChild(a);
    li.appendChild(delBtn);

    this.els.navList.appendChild(li);
    return { li, link: a, deleteBtn: delBtn };
  },
renderNewListInput() {
    // Öppna sidomeny om den är stängd
    if (this.els.sidebar.classList.contains("collapsed")) {
      sidebar.classList.remove("collapsed");
    }

    // Skapa DOM-element
    const li = document.createElement("li");
    li.classList.add("nav-item");

    const a = document.createElement("a");
    a.href = "#";
    a.classList.add("nav-link");

    const icon = document.createElement("span");
    icon.classList.add("material-symbols-outlined");
    icon.textContent = "dashboard";

    const input = document.createElement("input");
    input.classList.add("newListInput");
    input.type = "text";
    input.maxLength = 30;
    input.placeholder = "Max 30 tecken...";

    a.appendChild(icon);
    a.appendChild(input);
    li.appendChild(a);
    this.els.navList.appendChild(li);

    // Lås övriga klick
    this.lockInteractions();

    return { li, input };
  },

  lockInteractions() {
    document.body.style.pointerEvents = "none";
  },

  unlockInteractions() {
    document.body.style.pointerEvents = "auto";
  },

  showAlert(message) {
    alert(message);
  },

  lockInteractions() {
    document.body.style.pointerEvents = "none";
  },

  unlockInteractions() {
    document.body.style.pointerEvents = "auto";
  },

  showAlert(message) {
    alert(message);
  },

  // Main area
  clearMain() {
    this.els.listContainer.innerHTML = "";
    this.els.listNameH1.textContent = "";
  },

  setCurrentListTitle(name) {
    this.els.listNameH1.textContent = name;
  },

  renderTaskListDiv(listName, listDate) {
    const wrap = document.createElement("div");
    wrap.classList.add("taskListDiv");

    const h2 = document.createElement("h2");
    h2.textContent = `${listName}: ${listDate}`;

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.classList.add("deleteTaskListBtn");
    const delIcon = document.createElement("span");
    delIcon.classList.add("material-symbols-outlined");
    delIcon.textContent = "close";
    deleteBtn.appendChild(delIcon);

    const line = document.createElement("div");
    line.classList.add("line");

    const btnCont = document.createElement("div");
    btnCont.classList.add("btnContainer");

    const input = document.createElement("input");
    input.type = "text";
    input.classList.add("taskInput");
    input.placeholder = "Enter task…";

    const tskBtn = document.createElement("button");
    tskBtn.innerHTML = "+";
    tskBtn.type = "button";
    tskBtn.classList.add("taskButton");

    btnCont.appendChild(input);
    btnCont.appendChild(tskBtn);

    const ul = document.createElement("ul");
    ul.classList.add("taskList");

    wrap.appendChild(h2);
    wrap.appendChild(deleteBtn);
    wrap.appendChild(line);
    wrap.appendChild(btnCont);
    wrap.appendChild(ul);

    this.els.listContainer.appendChild(wrap);
    input.focus();

    return { wrap, ul, input, addBtn: tskBtn, deleteBtn };
  },

  renderTask(ul, listName, taskName) {
    const li = document.createElement("li");

    const chk = document.createElement("input");
    chk.type = "checkbox";
    chk.classList.add("chkbox");

    const input = document.createElement("input");
    input.type = "text";
    input.classList.add("miniTask"); // NOTE: consistent class (see bug fix #1)
    input.value = taskName;

    const deleteTaskBtn = document.createElement("button");
    deleteTaskBtn.classList.add("deleteTaskBtn");
    deleteTaskBtn.type = "button";
    const delIcon = document.createElement("span");
    delIcon.classList.add("material-symbols-outlined");
    delIcon.textContent = "delete";
    deleteTaskBtn.appendChild(delIcon);

    li.appendChild(chk);
    li.appendChild(input);
    li.appendChild(deleteTaskBtn);

    ul.appendChild(li);
    return { li, input, deleteBtn: deleteTaskBtn };
  },

  // Small UI helpers
  toggleSidebar() { this.els.sidebar.classList.toggle("collapsed");
    console.log("toggleSIdebar")
   },
  closeSettings() {
    this.els.ls.classList.toggle("d-none");
    this.els.selectedDate.value = "";
    this.els.selectedList.value = "";
  },
  openTaskInput() {
    this.els.ls.classList.toggle("d-none");
    this.els.selectedList.focus();
  },

  onEnterKey(e, callback){
    e.addeventListener("keydown", (event) => {
      if(event.key === "Enter") callback(e);
  });
  }
};
