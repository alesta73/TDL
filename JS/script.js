

// ---Dom Elements--- 
let ls = document.querySelector(".listSettings");
let addTask = document.querySelector(".addtask");
let addTaskBtn = document.querySelector(".addTaskBtn");
let closeListSettings = document.querySelector(".closeListSettings");
let editTask = document.querySelectorAll(".edit-task");
let sidebar = document.querySelector(".sidebar");
let navList = document.querySelector(".nav-list");
const selectedList = document.getElementById("listNameID");
const selectedDate = document.getElementById("dateID");
let createNewListBtn = document.querySelector(".createNewListBtn");

//init
window.onload = () => {
    if (selectedList) selectedList.value = "";
    if (selectedDate) selectedDate.value = "";
};

//Functions

//Sidebar


//List creation
//Task functions
//Utility

createNewListBtn.addEventListener("click", () => {

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

    // let secondSpan = document.createElement("span");
    // secondSpan.classList.add("nav-label");
    // secondSpan.textContent= "test"

    aElement.appendChild(firstSpan);
    //    aElement.appendChild(secondSpan);
    aElement.appendChild(input);
    li.appendChild(aElement);
    navList.appendChild(li);

    let listName;

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

                // 🔓 lås upp när klart
                document.body.style.pointerEvents = "auto";
            } else {
                alert("Ange namn på lista");
            }
        }
    });
    input.addEventListener("blur", () => {
        li.remove();

        document.body.style.pointerEvents = "auto"; // alltid lås upp
    });
})


// Code for sidebar
document.querySelector(".sidebar-toggler").addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
});

//  

// sidebar.addEventListener("click", () => {
//     if (sidebar.classList.contains("collapsed")) {
//         sidebar.classList.remove("collapsed");
//     }
// });

// sidebar.addEventListener("mouseleave", () => {
//     if (!sidebar.classList.contains("collapsed")) {
//         sidebar.classList.add("collapsed");
//     }
// });

sidebar.addEventListener("mouseenter", () =>{
     if (sidebar.classList.contains("collapsed")) {
        sidebar.classList.remove("collapsed");
    }
})

document.addEventListener("click", (e) => {
    // Kolla om klicket INTE var i sidebaren
    if (!sidebar.contains(e.target)) {
        sidebar.classList.add("collapsed");
    }
});
//end of sidebar

closeListSettings.addEventListener("click", () => {
    dNoneToggler(ls);
    selectedDate.value = "";
    listInput.value = "";
});

addTask.addEventListener("click", () => {

    dNoneToggler(ls);
    selectedList.focus();
});

selectedList.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault(); // prevent form submission if inside a form
        if (selectedDate && typeof selectedDate.showPicker === "function") {
            selectedDate.showPicker(); // opens the native date picker
        } else {
            selectedDate.focus(); // fallback if showPicker is not supported
        }
    }
});

// selectedDate.addEventListener("keydown", (e) => {
//     if (e.key === "Enter") {
//         e.preventDefault(); // prevent form submission if inside a form
//         if(selectedDate.value !== "" && selectedList.value!==""){
//             addTaskBtn.click();
//         }
//     }
// });

selectedDate.addEventListener("change", (e) => {
    if (selectedDate.value !== "" && selectedList.value !== "") {
        console.log("change")
        createTaskList();
    }
});




function dNoneToggler(data) {
    document.querySelector(data.classList.toggle("d-none"));

}

document.addEventListener("keydown", (event) => {
    if (event.target.classList.contains("taskInput") && event.key === "Enter") {
        event.preventDefault();
        const container = event.target.closest(".btnContainer");
        const button = container.querySelector(".taskButton");
        if (button) button.click();
    }
});


editTask.forEach(button => {
    button.addEventListener("click", (event) => {

    });
});


addTaskBtn.addEventListener("click", createTaskList);

function createTaskList() {
    const dateInput = document.querySelector("#dateID");
    // const listInput = document.querySelector("#listNameID");

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

    //convert input value into date object
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
    // console.log(displayDate);
    selectedList.value = "";
    dateInput.value = "";
    // ls.classList.toggle("d-none");
    dNoneToggler(ls);
}

document.querySelectorAll(".taskButton").forEach(button => {
    button.addEventListener("click", createTask);
});


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

document.addEventListener("click", (e) => {
    const activeInput = document.querySelector("input.miniTask:not(.noEdit)");
    if (activeInput && e.target !== activeInput && !e.target.closest(".edit-task")) {
        lockInput(activeInput);
    }
});

function lockInput(input) {
    input.classList.add("noEdit");
    input.blur();
}

// document.addEventListener("click", (e) => {
//     const activeInput = document.querySelector("input.taskInput:not(.noEdit)");
//     if (activeInput && e.target !== activeInput && !e.target.closest(".edit-task")) {
//         lockInput(activeInput);
//     }
// });

function lockInput(input) {
    input.classList.add("noEdit");
    input.blur();
}


function listBuilder(listName, listDate) {
    console.log(listName, listDate)
    //skapar container till listan
    let list = document.createElement("div");
    list.classList.add("list1");
    //namn på lista
    let h2 = document.createElement("h2");
    h2.innerHTML = listName + ": " + listDate;
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


function taskBuilder() {
    let input = document.createElement("input");
    input.type = "text";

    let task = document.createElement("div");
    task.classList.add("task");
}

// function getDate() {
//     const d = new Date();
//     const weekdays = ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"];
//     return weekdays[d.getDay()];
// }


// sidebar.addEventListener("click", () => {
//     if (sidebar.classList.contains("collapsed")) {
//         sidebar.classList.remove("collapsed");
//     }
// });
// sidebar.addEventListener("mouseout", () => {
//     if (!sidebar.classList.contains("collapsed")) {
//         sidebar.classList.add("collapsed");
//     }});

