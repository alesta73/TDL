export default {
    initEventListeners() {
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
    },
    resetInputs(selectedList, selectedDate) {
        if (selectedList) selectedList.value = "";
        if (selectedDate) selectedDate.value = "";
    },
    renderSidebarList(listName) {

    },
    renderTaskList(taskListObj) {

    },
    renderTask(listName, ul, inputOrTask) {

    },
    handleCreateNewList() {

        if (sidebar.classList.contains("collapsed")) {
            sidebar.classList.remove("collapsed");
        }

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
        input.maxLength = 30;
        input.placeholder = "Max 30 tecken..."

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


                    let deleteListBtn = document.createElement("button");
                    deleteListBtn.type = "button;"
                    deleteListBtn.classList.add("deleteListBtn");
                    deleteListBtn.addEventListener("click", (e) => deleteJSON(e, "list"));

                    let deleteSpan = document.createElement("span");
                    deleteSpan.classList.add("material-symbols-outlined");
                    deleteSpan.textContent = "close";

                    deleteListBtn.appendChild(deleteSpan);

                    aElement.removeChild(input);
                    aElement.appendChild(secondSpan);
                    li.appendChild(deleteListBtn);
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
    },
    loadListsFromLocalStorage() {
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


                let deleteListBtn = document.createElement("button");
                deleteListBtn.type = "button;"
                deleteListBtn.classList.add("deleteListBtn");

                let deleteSpan = document.createElement("span");
                deleteSpan.classList.add("material-symbols-outlined");
                deleteSpan.textContent = "close";

                console.log(listName);
                deleteListBtn.addEventListener("click", (e) => deleteJSON(e, ["list", listName]));
                deleteListBtn.appendChild(deleteSpan);


                aElement.appendChild(firstSpan);
                aElement.appendChild(secondSpan);
                li.appendChild(aElement);
                li.appendChild(deleteListBtn);
                navList.appendChild(li);
            }
        }
    },
    loadListToMain(listName) {
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
    },
    loadTasksToMain(ul, task) {
        console.log("loadtasktomain")
        let taskName = task.name;
        console.log(ul);
        console.log(taskName);
    },
    createTask(listName, ul, inputOrTask) {
        const li = document.createElement("li");
        const input = document.createElement("input");
        input.type = "text";
        input.classList.add("minitask");//"noEdit"

        //hämta taskname
        let taskName = "";
        if (inputOrTask instanceof HTMLElement) {
            taskName = inputOrTask.value.trim();
            console.log(taskName);
        } else if (inputOrTask && typeof inputOrTask === "object" && "name" in inputOrTask) {
            taskName = inputOrTask.name.trim();
            console.log(taskName);
        }

        if (!taskName) {
            if (inputOrTask instanceof HTMLElement) {
                alert("Ange en uppgift");
            }
            return;
        }

        input.value = taskName;

        if (inputOrTask instanceof (HTMLElement)) {
            console.log("inputortask: ", inputOrTask)
            inputOrTask.value = "";
        }

        //UI checkbox och edit knapp: 

        let chkbox = document.createElement("input");
        chkbox.type = "checkbox";
        chkbox.classList.add("chkbox");

        let editBtnContainer = document.createElement("div");
        editBtnContainer.classList.add("editBtnContainer");

        let deleteTaskBtn = document.createElement("button");
        deleteTaskBtn.classList.add("deleteTaskBtn"); //"edit-task"
        deleteTaskBtn.type = "button";

        // let editTaskBtn = document.createElement("button");
        // editTaskBtn.classList.add("edit-task");


        let span = document.createElement("span");
        span.classList.add("material-symbols-outlined");
        span.innerHTML = "edit";

        let span2 = document.createElement("span");
        span2.classList.add("material-symbols-outlined");
        span2.innerHTML = "delete";

        // btn.appendChild(span);
        deleteTaskBtn.appendChild(span2);
        editBtnContainer.appendChild(deleteTaskBtn);
        // editBtnContainer.appendChild(editTaskBtn)


        // DeleteTaskbutton handler
        deleteTaskBtn.addEventListener("click", (e) => deleteJSON(e, ["task", listName, taskName]));

        // deleteTaskBtn.addEventListener("click", (e) => {
        //     e.stopPropagation(); // prevent document click from firing
        //     input.classList.remove("noEdit");
        //     input.focus();
        // });

        // Enter to lock input
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                lockInput(input);
            }
        });

        li.appendChild(chkbox);
        li.appendChild(input);
        // li.appendChild(btn);
        // li.appendChild(editBtnContainer);
        li.appendChild(deleteTaskBtn)
        ul.appendChild(li);
        updateJSON([listName, "newTask", taskName, getCurrentList()]);
    },
    toggleSidebar() {
        sidebar.classList.toggle("collapsed");
    },
    expandSidebar() { if (sidebar.classList.contains("collapsed")) sidebar.classList.remove("collapsed"); },
    handleDocumentClick(e) { if (!sidebar.contains(e.target)) sidebar.classList.add("collapsed"); },
    handleListInputKeydown(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            if (selectedDate && typeof selectedDate.showPicker === "function") {
                selectedDate.showPicker();
            } else {
                selectedDate.focus();
            }
        }
    },
    handleDateChange(e) {
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
    },
    handleTaskInputEnter(event) {
        if (event.target.classList.contains("taskInput") && event.key === "Enter") {
            event.preventDefault();
            const container = event.target.closest(".btnContainer");
            const button = container.querySelector(".taskButton");
            if (button) button.click();
        }
    },
    listBuilder(taskListOrName, maybeDate) {
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
        list.classList.add("taskListDiv");

        let h2 = document.createElement("h2");
        h2.innerHTML = listName + ": " + listDate;

        let deleteTaskListBtn = document.createElement("button");
        deleteTaskListBtn.type = "button;"
        deleteTaskListBtn.classList.add("deleteTaskListBtn");

        let deleteSpan = document.createElement("span");
        deleteSpan.classList.add("material-symbols-outlined");
        deleteSpan.textContent = "close";

        deleteTaskListBtn.addEventListener("click", (e) => deleteJSON(e, ["taskList", listName]));
        deleteTaskListBtn.appendChild(deleteSpan);


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
        list.appendChild(deleteTaskListBtn);
        list.appendChild(line);
        list.appendChild(btnCont);
        list.appendChild(ul);
        document.querySelector(".list-container").appendChild(list);
        input.focus();
        // console.log(taskList)

    },
    handleMiniTaskBlur(e) {
    const activeInput = document.querySelector("input.miniTask:not(.noEdit)");
    if (activeInput && e.target !== activeInput && !e.target.closest(".edit-task")) {
        lockInput(activeInput);
    }
}, lockInput(input) { input.classList.add("noEdit"); input.blur(); },
// --- Utility Functions ---
dNoneToggler(data) { data.classList.toggle("d-none"); },
closeSettings() { dNoneToggler(ls); selectedDate.value = ""; selectedList.value = ""; },
openTaskInput() { dNoneToggler(ls); selectedList.focus(); },
getCurrentList() { let listName = listNameH1.textContent; return listName; },
clearMain() { document.querySelector(".list-container").innerHTML = ""; listNameH1.textContent = ""; },



}