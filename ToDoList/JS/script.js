

let ls = document.querySelector(".listSettings");
let addTask = document.querySelector(".addtask");
let addTaskBtn = document.querySelector(".addTaskBtn");
let closeListSettings = document.querySelector(".closeListSettings");
let editTask = document.querySelectorAll(".edit-task");
let sidebar = document.querySelector(".sidebar");

const selectedList = document.getElementById("listNameID");
const selectedDate = document.getElementById("selectedDate");
window.onload = () => {
  if (selectedList) selectedList.value = "";
  if (selectedDate) selectedDate.value = "";
};


document.querySelector(".sidebar-toggler").addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
});

// sidebar.addEventListener("click", () => {
//     console.log("clicked");
//     sidebar.classList.toggle("collapsed");
// });

sidebar.addEventListener("mouseenter", () => {
    if (sidebar.classList.contains("collapsed")) {
        sidebar.classList.remove("collapsed");
    }});

sidebar.addEventListener("mouseleave", () => {
    if (!sidebar.classList.contains("collapsed")) {
        sidebar.classList.add("collapsed");
    }});


closeListSettings.addEventListener("click", () => {
    dNoneToggler(ls);
    selectedDate.value = "";
    listInput.value = "";
});

addTask.addEventListener("click", () => {
    dNoneToggler(ls);
});

function dNoneToggler(data) {
    document.querySelector(data.classList.toggle("d-none"));
}

document.addEventListener("keydown", (event) =>{
    if(event.target.classList.contains("taskInput") && event.key === "Enter"){
        event.preventDefault();
        const container = event.target.closest(".btnContainer");
        const button = container.querySelector(".taskButton");
        if(button) button.click(); 
    }
});


editTask.forEach(button => {
    button.addEventListener("click", (event) => {

    });
});


addTaskBtn.addEventListener("click", createTaskList);

function createTaskList() {
    const dateInput = document.querySelector("#dateID");
    const listInput = document.querySelector("#listNameID");
    if(dateInput.value === "") {
        console.log("Ange datum");
        alert("Ange datum");
        return;
    }

    //convert input value into date object
    const selected = new Date(dateInput.value);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    today.setHours(0,0,0,0);
    tomorrow.setHours(0,0,0,0);
    selected.setHours(0,0,0,0);
    let displayDate = "";

    if(selected.getTime() === today.getTime()){
        displayDate = "Idag";
    } else if(selected.getTime() === tomorrow.getTime()){
        displayDate = "Imorgon";
    } else{
        displayDate = dateInput.value;
    }

    listBuilder(displayDate);
    // console.log(displayDate);
    listInput.value = "";
    dateInput.value = "";
    ls.classList.toggle("d-none");
    // dNoneToggler(ls);
}

document.querySelectorAll(".taskButton").forEach(button => {
    button.addEventListener("click", createTask);
});


function createTask(event) {
    // console.log("In createTask");
    let inputTask = event.currentTarget.closest(".btnContainer").querySelector(".taskInput");
    const listContainer = event.currentTarget.closest(".list1");
    // const taskList = listContainer.querySelector(".taskList");
    const taskList = event.currentTarget.closest(".list1").querySelector(".taskList");
    // console.log(taskList);

    const li = document.createElement("li");
    const input = document.createElement("input");

    // console.log(listContainer);
    input.type = "text";
    input.classList.add("taskInput");
    input.classList.add("noEdit");
    
    if (inputTask.value === "") {
        alert("Ange en uppgift");
        return;
    } else {
        
        input.value = inputTask.value;
        inputTask.value = "";

        let chkbox = document.createElement("input");
        chkbox.type = "checkbox";
        chkbox.classList.add("chkbox");
        li.appendChild(chkbox);

        let btn = document.createElement("button");
        btn.classList.add("edit-task");
        // btn.innerHTML = "edit";
        btn.type = "button";


        let span = document.createElement("span");
        span.classList.add("material-symbols-outlined");
        // span.classList.add("edit-task");
        span.innerHTML = "edit";

        btn.appendChild(span);
        btn.addEventListener("click", () => {
            const li = btn.closest("li");
            const input = li.querySelector(".taskInput");
            if (input) {
                input.focus();
            }
        });



        // let editBtn = document.createElement("button");
        // editBtn.classList.add("edit-task");
        // editBtn.innerHTML = "Edit";
        // editBtn.classList.add(".edit-task");

        li.appendChild(chkbox);
        li.appendChild(input);
        li.appendChild(btn);
        taskList.appendChild(li);
    }
}

function listBuilder(data) {
    //skapar container till listan
    let list = document.createElement("div");
    list.classList.add("list1");
    //namn på lista
    let h2 = document.createElement("h2");
    h2.innerHTML = data;
    //linje under namn
    let line = document.createElement("div");
    line.classList.add("line");

    let btnCont = document.createElement("div");
    btnCont.classList.add("btnContainer");

    let ul = document.createElement("ul");
    ul.classList.add("taskList");
    

    let input = document.createElement("input");
    input.type = "text";
    input.classList.add("taskInput");
    input.placeholder = "Enter Task";
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


function taskBuilder() {
    let input = document.createElement("input");
    input.type = "text";

    let task = document.createElement("div");
    task.classList.add("task");
}

function getDate() {
    const d = new Date();
    const weekdays = ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"];
    return weekdays[d.getDay()];
}


// sidebar.addEventListener("click", () => {
//     if (sidebar.classList.contains("collapsed")) {
//         sidebar.classList.remove("collapsed");
//     }   
// });
// sidebar.addEventListener("mouseout", () => {
//     if (!sidebar.classList.contains("collapsed")) {
//         sidebar.classList.add("collapsed");
//     }});

