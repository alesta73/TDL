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
  },

  resetInputs(){
    const { selectedList, selectedDate } = this.els;
    if(selectedList) selectedList.value = "";
    if(selectedDate) selectedDate.value = "";
  },

  renderSidebarList(listName){
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

    const delBtn = document.createElement("button");
    delBtn.type= "button";
    delBtn.classList.add("deleteListBtn");
    const delIcon = document.createElement("span");
    delIcon.classList.add("material-symbols-outlined");
    delIcon.textContent("close");
    delBtn.appendChild(delIcon);

    a.appendChild(icon);
    a.appendChild(label);
    li.appendChild(a);
    li.appendChild(delBtn);

    this.els.navList.appendChild(li);
    return {li, link: a, deleteBtn: delBtn};
  },
}