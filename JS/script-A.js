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
const dateInput = document.querySelector("#dateID");

// --- Initialization ---
window.onload = resetInputs;
initEventListeners();
// initMainList();
createJSON();
loadListsFromLocalStorage();

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
    if (e.target.closest("a")) {
        const clickedListName = e.target.closest("a").querySelector(".nav-label").textContent;
        console.log("i handlenavclick")
        loadListToMain(clickedListName);
        // console.log("Clicked list name:", clickedListName);
    }
};
function toggleSidebar() { sidebar.classList.toggle("collapsed"); }
function expandSidebar() { if (sidebar.classList.contains("collapsed")) sidebar.classList.remove("collapsed"); }
function handleDocumentClick(e) { if (!sidebar.contains(e.target)) sidebar.classList.add("collapsed"); }

// --- List Creation Functions ---

function loadListsFromLocalStorage() {
    console.log("I loadlistsfromls")
    let obj = readJSON();
    // console.log("Obj från readJSON:", obj);
    if (obj) {
        let parsedObj = JSON.parse(obj);
        // console.log("ParsedObj:", parsedObj);
        for (let listName in parsedObj) {
            console.log(parsedObj)
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
    if (!listName) { listName = Object.keys(obj)[0]; }
    // console.log("Loading list:", listName);
    const selectedList = obj[listName];
    if (!selectedList) {
        console.warn("No list found for:", listName);
        return;
    }

    clearMain();
    listNameH1.textContent = listName;
    console.log(selectedList);
    Object.values(selectedList.taskLists).forEach(taskList => {
        // console.log(taskList);           // hela objektet
        listBuilder(taskList); // anropa din listBuilder
    });
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
    // console.log(selectedList.value);

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

    if (selectedDate.value !== "" && selectedList.value !== "") {
        console.log("change")
        createTaskList();
    }
}

function createTaskList() {
    console.log()



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

function listBuilder(taskListOrName, maybeDate) {
    console.log("I listbuilder")

    let listName, listDate, tasks;

    if (typeof taskListOrName === "object") {
        //om task kommer från localstorage
        listName = taskListOrName.name;
        listDate = taskListOrName.date;
        tasks = taskListOrName.tasks || {};
        console.log(listName)
        console.log(listDate)
        console.log(tasks)
    } else {
        //om task skapas nu
        listName = taskListOrName;
        listDate = maybeDate;
        tasks = {};
        console.log(listName)
        console.log(listDate)
    }
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


    Object.values(tasks).forEach(task => {
        // console.log(taskList);           // hela objektet
        console.log("---------------------------------------------------------")
        console.log("Task: ", task);
        // loadTasksToMain(ul, task)
        createTask(listName, ul, task);
    });

    let input = document.createElement("input");
    input.type = "text";
    input.classList.add("taskInput");
    input.placeholder = "Enter Tihi";
    btnCont.appendChild(input);

    let tskBtn = document.createElement("button");
    tskBtn.innerHTML = "+";
    tskBtn.classList.add("taskButton");
    // tskBtn.addEventListener("click", createTask(listName, ul, input));
    tskBtn.addEventListener("click", () => createTask(listName, ul, input));
    tskBtn.type = "button";

    btnCont.appendChild(tskBtn);

    list.appendChild(h2);
    list.appendChild(line);
    list.appendChild(btnCont);
    list.appendChild(ul);
    document.querySelector(".list-container").appendChild(list);
    input.focus();
    // console.log(taskList)

}

// --- Task Functions ---


function loadTasksToMain(ul, task) {
    console.log("loadtasktomain")
    let taskName = task.name;
    console.log(ul);
    console.log(taskName);
}
function createLi(event) {
    let li = document.createElement("li");
}

function createTask(listName, ul, inputOrTask){
    const li = document.createElement("li");
    const input = document.createElement("input");
    input.type = "text";
    input.classList.add("minitask", "noEdit");

    //hämta taskname
    let taskName = "";
    if(inputOrTask instanceof HTMLElement){
        taskName = inputOrTask.value.trim();
        console.log(taskName);
    } else if(inputOrTask && typeof inputOrTask === "object" && "name" in inputOrTask){
        taskName = inputOrTask.name.trim();
        console.log(taskName);
    }

    if(!taskName){
        if(inputOrTask instanceof HTMLElement){
        alert("Ange en uppgift");
        }
      return;
    }

    input.value = taskName;

    if(inputOrTask instanceof(HTMLElement)){
        console.log("inputortask: ", inputOrTask)
        inputOrTask.value = "";
    }

    //UI checkbox och edit knapp: 

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
        ul.appendChild(li);
        updateJSON([listName, "newTask", taskName, getCurrentList()]);

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
function clearMain() { document.querySelector(".list-container").innerHTML = ""; listNameH1.textContent = ""; }

// --- List loading ---
// --- JSON handling ---

function saveMainList(updatedList) {
    localStorage.setItem("mainList", JSON.stringify(updatedList));
}

function createJSON() {
    let curJSON = readJSON();
    if (!curJSON) {
        const defaultData = {
            "Default List": {
                name: "Default List",
                taskLists: {}
            }
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
        let newList = {
            name: listName,
            taskLists: {
            }
        };
        obj[listName] = newList;
        // console.log(obj[listName])
        saveMainList(obj);
        // localStorage.setItem("mainList", JSON.stringify(obj));
    }
    else if (data[1] === "taskList") {
        let taskListName = data[0];
        let currentList = data[2];
        let taskDate = data[3];

        let curList = obj[currentList];

        // console.log("CurrentList:", currentList);
        // console.log("TaskListName:", taskListName);

        const newTaskList = {
            id: crypto.randomUUID(),
            name: taskListName,
            date: taskDate,
            tasks: {}
        };

        curList.taskLists[taskListName] = newTaskList;
        // obj[taskListName] = newTaskList;
        saveMainList(obj);
        // console.log(curList.taskLists[taskListName].tasks)
    }

    else if (data[1] === "newTask") {

        let curJSON = readJSON();
        let obj = JSON.parse(curJSON);

        let taskListName = data[0];
        let currentList = data[3];
        let taskName = data[2];

        let curList = obj[currentList]

        let newTask = {
            name: taskName,
        };

        if (!curList.taskLists[taskListName].tasks) {
            curList.taskLists[taskListName].tasks = {};
        }


        // console.log(curList.taskLists[taskListName])
        curList.taskLists[taskListName].tasks[newTask.name] = newTask;
        saveMainList(obj);
    }
}

function deleteJSON() {
    //take call from updateJSON to delete
    //Recieve obj to delete
    //delete said obj
    //call updateJSON with new list
}