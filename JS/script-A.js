// --- DOM Elements ---
const ls = document.querySelector(".listSettings");
const addTask = document.querySelector(".addtask");
const addTaskBtn = document.querySelector(".addTaskBtn");
const closeListSettings = document.querySelector(".closeListSettings");
const sidebar = document.querySelector(".sidebar");
const navList = document.querySelector(".nav-list");
const selectedList = document.getElementById("listNameID");
const selectedDate = document.getElementById("dateID");
const createNewListBtn = document.querySelector(".createNewListBtn");

// --- Initialization ---
window.onload = resetInputs;
initEventListeners();
let curJSON = readJSON();

// --- Functions ---

function resetInputs() {
    if (selectedList) selectedList.value = "";
    if (selectedDate) selectedDate.value = "";
}

function initEventListeners() {
    createNewListBtn.addEventListener("click", handleCreateNewList);
    document.querySelector(".sidebar-toggler").addEventListener("click", toggleSidebar);
    // sidebar.addEventListener("mouseenter", expandSidebar);
    document.addEventListener("click", handleDocumentClick);
    closeListSettings.addEventListener("click", closeSettings);
    addTask.addEventListener("click", openTaskInput);
    selectedList.addEventListener("keydown", handleListInputKeydown);
    selectedDate.addEventListener("change", handleDateChange);
    addTaskBtn.addEventListener("click", createTaskList);
    document.querySelectorAll(".taskButton").forEach(btn => btn.addEventListener("click", createTask));
    document.addEventListener("keydown", handleTaskInputEnter);
    document.addEventListener("click", handleMiniTaskBlur);
}

// --- Sidebar Functions ---

function toggleSidebar() { sidebar.classList.toggle("collapsed"); }
function expandSidebar() { if (sidebar.classList.contains("collapsed")) sidebar.classList.remove("collapsed"); }
function handleDocumentClick(e) { if (!sidebar.contains(e.target)) sidebar.classList.add("collapsed"); }

// --- List Creation Functions ---

function handleCreateNewList() {

    if (sidebar.classList.contains("collapsed")) {
        sidebar.classList.remove("collapsed");
    }
    let newListInput = document.createElement("input");
    newListInput.type = "text";
    newListInput.classList.add("newListInput");

    let newListLink = document.createElement("div");

    let li = document.createElement("li");
    li.classList.add("nav-item");

    let aElement = document.createElement("a");
    aElement.href = "#";
    aElement.classList.add("nav-link");

    let firstSpan = document.createElement("span");
    firstSpan.classList.add("material-symbols-outlined");
    firstSpan.textContent = "dashboard";

    let input = document.createElement("input");
    input.classList.add("newListInput");
    input.type = "text";

    aElement.appendChild(firstSpan);
    aElement.appendChild(input);
    li.appendChild(aElement);
    navList.appendChild(li);
    input.focus();
    document.body.style.pointerEvents = "none";   // Stänger av klick
    input.style.pointerEvents = "auto";

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            if (input.value.trim() !== "") {
                let listName = input.value.trim();
                let secondSpan = document.createElement("span");
                secondSpan.classList.add("nav-label");
                secondSpan.textContent = listName;

                aElement.removeChild(input);
                aElement.appendChild(secondSpan);
                // lås upp när klart
                document.body.style.pointerEvents = "auto";

                updateJSON([listName, "newList"]);
            } else {
                alert("Ange namn på lista");
            }
        }
    });
    input.addEventListener("blur", () => {
        li.remove();
        document.body.style.pointerEvents = "auto"; // alltid lås upp
    });
}

function handleListInputKeydown(e) {
    if (e.key === "Enter") {
        e.preventDefault();
        if (selectedDate && typeof selectedDate.showPicker === "function") {
            selectedDate.showPicker();
        } else {
            selectedDate.focus();
        }
    }
}

function handleDateChange(e) {
    if (selectedDate.value !== "" && selectedList.value !== "") {
        console.log("change")
        createTaskList();
    }
}

function createTaskList() {
    const dateInput = document.querySelector("#dateID");

    if (selectedList.value === "") {
        console.log("Ange namn på lista");
        alert("Ange namn på lista");
        return
    }
    if (dateInput.value === "") {
        console.log("Ange datum");
        alert("Ange datum");
        return;
    }

    const selected = new Date(dateInput.value);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    selected.setHours(0, 0, 0, 0);
    let displayDate = "";

    if (selected.getTime() === today.getTime()) {
        displayDate = "Idag";
    } else if (selected.getTime() === tomorrow.getTime()) {
        displayDate = "Imorgon";
    } else {
        displayDate = dateInput.value;
    }
    let listName = selectedList.value;
    listBuilder(listName, displayDate);

    selectedList.value = "";
    dateInput.value = "";

    dNoneToggler(ls);
}

function listBuilder(listName, listDate) {
    console.log(listName, listDate)

    let list = document.createElement("div");
    list.classList.add("list1");

    let h2 = document.createElement("h2");
    h2.innerHTML = listName + ": " + listDate;

    let line = document.createElement("div");
    line.classList.add("line");

    let btnCont = document.createElement("div");
    btnCont.classList.add("btnContainer");

    let ul = document.createElement("ul");
    ul.classList.add("taskList");


    let input = document.createElement("input");
    input.type = "text";
    input.classList.add("taskInput");
    input.placeholder = "Enter Tihi";
    btnCont.appendChild(input);


    let tskBtn = document.createElement("button");
    tskBtn.innerHTML = "+";
    tskBtn.classList.add("taskButton");
    tskBtn.addEventListener("click", createTask);
    tskBtn.type = "button";

    btnCont.appendChild(tskBtn);

    list.appendChild(h2);
    list.appendChild(line);
    list.appendChild(btnCont);
    list.appendChild(ul);
    document.querySelector(".list-container").appendChild(list);
    input.focus();
}

// --- Task Functions ---
function createTask(event) {
    let inputTask = event.currentTarget.closest(".btnContainer").querySelector(".taskInput");
    const taskList = event.currentTarget.closest(".list1").querySelector(".taskList");

    const li = document.createElement("li");
    const input = document.createElement("input");
    input.type = "text";
    input.classList.add("miniTask", "noEdit");

    if (inputTask.value === "") {
        alert("Ange en uppgift");
        return;
    } else {
        input.value = inputTask.value;
        inputTask.value = "";

        let chkbox = document.createElement("input");
        chkbox.type = "checkbox";
        chkbox.classList.add("chkbox");

        let btn = document.createElement("button");
        btn.classList.add("edit-task");
        btn.type = "button";

        let span = document.createElement("span");
        span.classList.add("material-symbols-outlined");
        span.innerHTML = "edit";

        btn.appendChild(span);

        // Edit button handler
        btn.addEventListener("click", (e) => {
            e.stopPropagation(); // prevent document click from firing
            input.classList.remove("noEdit");
            input.focus();
        });

        // Enter to lock input
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                lockInput(input);
            }
        });

        li.appendChild(chkbox);
        li.appendChild(input);
        li.appendChild(btn);
        taskList.appendChild(li);
    }
}

function handleTaskInputEnter(event) {
    if (event.target.classList.contains("taskInput") && event.key === "Enter") {
        event.preventDefault();
        const container = event.target.closest(".btnContainer");
        const button = container.querySelector(".taskButton");
        if (button) button.click();
    }
}
function handleMiniTaskBlur(e) {
    const activeInput = document.querySelector("input.miniTask:not(.noEdit)");
    if (activeInput && e.target !== activeInput && !e.target.closest(".edit-task")) {
        lockInput(activeInput);
    }
}
function lockInput(input) { input.classList.add("noEdit"); input.blur(); }

// --- Utility Functions ---
function dNoneToggler(data) { data.classList.toggle("d-none"); }
function closeSettings() { dNoneToggler(ls); selectedDate.value = ""; selectedList.value = ""; }
function openTaskInput() { dNoneToggler(ls); selectedList.focus(); }


// --- JSON handling ---

function createJSON() {
    console.log("I createJSON");
    //if no JSON: 
    //create empty mainList
    const mainList = {};
    localStorage.setItem("mainList", mainList);
    readJSON();

}

function readJSON() {
    //have to add errorhandling try catch. 
    if (localStorage.getItem("mainList")) {
        let jsonString = localStorage.getItem("mainList");
        console.log(jsonString);
        return jsonString;
    } else {
        alert("ingen localStorage");
        createJSON();
    }

}

function updateJSON(data) {
    let curJSON = readJSON();
    let obj = JSON.parse(curJSON);

    if (data[1] === "newList") {
        let listName = data[0];

        let newList = {
            taskList: []
        };

        obj[listName] = newList;

        localStorage.setItem("mainList", JSON.stringify(obj));
    } else {
        console.log("nå annat");
    }


    //parse json and look for relevant data point
    // replace said data point
    // call createJSON || make a new setItem call directly from updateJSON. 
}

function deleteJSON() {
    //take call from updateJSON to delete
    //Recieve obj to delete
    //delete said obj
    //call updateJSON with new list
}