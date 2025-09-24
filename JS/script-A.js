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
const listNameH1 = document.querySelector(".listname");
const listContainer = document.querySelector(".list-container"); 

// --- Initialization ---
window.onload = resetInputs;
initEventListeners();
// initMainList();
createJSON();
loadListsFromLocalStorage();
loadListToMain();
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
    navList.addEventListener("click", handleNavListClick);
    
}

// --- Sidebar Functions ---
function handleNavListClick(e) {
    e.preventDefault();
    if(e.target.closest("a")) {
    const clickedListName = e.target.closest("a").querySelector(".nav-label").textContent;
    loadListToMain(clickedListName);
    console.log("Clicked list name:", clickedListName);
    }
};
function toggleSidebar() { sidebar.classList.toggle("collapsed"); }
function expandSidebar() { if (sidebar.classList.contains("collapsed")) sidebar.classList.remove("collapsed"); }
function handleDocumentClick(e) { if (!sidebar.contains(e.target)) sidebar.classList.add("collapsed"); }

// --- List Creation Functions ---

//laddar in listor från localStorage
// function initMainList() {
//     console.log("I initMainList");
//     let curJSON = readJSON();
//     if (!curJSON) {
//         let defaultData = {
//             "Default List": {}
//         };
//         localStorage.setItem("mainList", JSON.stringify(defaultData));
//     }
// }
function loadListsFromLocalStorage() {
    let obj = readJSON();
    console.log("Obj från readJSON:", obj);
    if (obj) {
        let parsedObj = JSON.parse(obj);
        console.log("ParsedObj:", parsedObj);
        for (let listName in parsedObj) {
            console.log("Listnamn:", listName);

            let li = document.createElement("li");
            li.classList.add("nav-item");

            let aElement = document.createElement("a");
            aElement.href = "#";
            aElement.classList.add("nav-link");
            aElement.addEventListener("click", loadListToMain(listName));

            let firstSpan = document.createElement("span");
            firstSpan.classList.add("material-symbols-outlined");
            firstSpan.textContent = "dashboard";

            let secondSpan = document.createElement("span");
            secondSpan.classList.add("nav-label");
            secondSpan.textContent = listName;


            aElement.appendChild(firstSpan);
            aElement.appendChild(secondSpan);
            li.appendChild(aElement);
            navList.appendChild(li);
        }
    }
}


function loadListToMain(listName) {
    //laddar in vald lista till main
    let curJSON = readJSON();
    let obj = JSON.parse(curJSON);
    if(!listName) { listName = Object.keys(obj)[0]; }
    console.log("Loading list:", listName);
    const selectedList = obj[listName];
    if(!selectedList){
        console.warn("No list found for:", listName);
        return;
    } 

    clearMain();
    listNameH1.textContent = listName;
    selectedList.forEach(taskList => {
        listBuilder(taskList.name, taskList.date);
    });


    // console.log(obj);
    // let firstKey = Object.keys(obj)[0];
    // let selectedList = obj[firstKey];
    // console.log("FirstKey:", firstKey);
  //  console.log(selectedList);

    // let listName = firstKey;
    // listNameH1.textContent = listName;

    // selectedList.forEach(taskList => {
    //     console.log("TaskList:", taskList);
    //     listBuilder(taskList.name, taskList.date);
    // });
}

function handleCreateNewList() {

    if (sidebar.classList.contains("collapsed")) {
        sidebar.classList.remove("collapsed");
    }
    let newListInput = document.createElement("input");
    newListInput.type = "text";
    newListInput.classList.add("newListInput");

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
    updateJSON([listName, "taskList", getCurrentList(), displayDate]);

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
function getCurrentList() { let listName = listNameH1.textContent; return listName; }
function clearMain() { console.log("I clearmain"); document.querySelector(".list-container").innerHTML = ""; listNameH1.textContent = ""; }

// --- List loading ---
// --- JSON handling ---

function saveMainList(updatedList) {
    localStorage.setItem("mainList", JSON.stringify(updatedList));
}


function createJSON() {
    let curJSON = readJSON();
    if (!curJSON) {
        const defaultData = {
            "Default List": []
        };
        saveMainList(defaultData);
    } //om mainList redan finns, gör inget
}

function readJSON() {
    //hämtar mainList från localStorage
    return localStorage.getItem("mainList");
}

function updateJSON(data) {
    let curJSON = readJSON();
    let obj = JSON.parse(curJSON);

    if (data[1] === "newList") {
        let listName = data[0];

        let newList = [];

        obj[listName] = newList;

        saveMainList(obj);
        // localStorage.setItem("mainList", JSON.stringify(obj));
    }
    else if (data[1] === "taskList") {
        let taskListName = data[0];
        let currentList = data[2];
        let taskDate = data[3];

        console.log("CurrentList:", currentList);
        console.log("TaskListName:", taskListName);

        const newTaskList = {
            id: crypto.randomUUID(),
            name: taskListName,
            date: taskDate,
            tasks: []
        };

        obj[currentList].push(newTaskList);
        saveMainList(obj);
        // localStorage.setItem("mainList", JSON.stringify(obj))
        console.log("Created task list: ", newTaskList);
    } else if (data[1] === "newTask") {
        let taskListName = data[0];
        let taskName = data[2];
        let currentList = data[3];
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