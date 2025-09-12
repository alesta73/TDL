let ls = document.querySelector(".listSettings");
let selectedDate = document.querySelector("#dateID");
document.onload = () => {
    selectedDate.value = "";
}

document.querySelector(".sidebar-toggler").addEventListener("click", () => {
    document.querySelector(".sidebar").classList.toggle("collapsed");
});


document.querySelector(".addtask").addEventListener("click", () => {
    dNoneToggler(ls);
    // console.log("test");
    // let div = document.createElement("div");
    //div.classList.add("list1");
    //console.log(getDate());
    //let completionDate = document.createElement("h2");
    //completionDate.innerHTML = getDate();

    //document.querySelector(".list-container").appendChild(div);
});





document.querySelector(".addTaskBtn").addEventListener("click", () => {
    
   
    if (selectedDate.value == "") {
        console.log("Ange datum")
        alert("Ange datum");
    } else {
        selectedDate = document.querySelector("#dateID").value;
        listBuilder(selectedDate);
        console.log(selectedDate.value);
        selectedDate.value = "";
        dNoneToggler(ls);
        // document.querySelector(".listSettings").classList.toggle("d-none");
    }
});

//Click event for task button
document.querySelectorAll(".taskButton").forEach(button => {
    button.addEventListener("click", (event) =>{
        const listContainer = event.currentTarget.closest(".list1");
        const taskList = listContainer.querySelector(".taskList");

        const li = document.createElement("li");
        const input = document.createElement("input");
        input.type = "text";
        input.classList.add("taskInput");

        li.appendChild(input);
        taskList.appendChild(li);
    });
});

function dNoneToggler(data) {
    document.querySelector(data.classList.toggle("d-none"));
}


function listBuilder(data){
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
    
    let tskBtn = document.createElement("button");
    tskBtn.innerHTML = "+";
    tskBtn.classList.add("taskButton"); 

    btnCont.appendChild(tskBtn);
    
    list.appendChild(h2);
    list.appendChild(line);
    list.appendChild(btnCont);
    document.querySelector(".list-container").appendChild(list);
}
function taskBuilder(){
    let input = document.createElement("input");
    input.type="text";



    
    let task = document.createElement("div");
    task.classList.add("task");
}

function getDate() {
    const d = new Date();
    const weekdays = ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"];
    return weekdays[d.getDay()];
}
