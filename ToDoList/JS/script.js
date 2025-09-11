document.querySelector(".sidebar-toggler").addEventListener("click", () => {
    document.querySelector(".sidebar").classList.toggle("collapsed");
});

document.querySelector(".addtask").addEventListener("click", () => {
    console.log("test");
    let div = document.createElement("div");
    div.classList.add("list1");
    //console.log(getDate());
    let completionDate = document.createElement("h2");
    completionDate.innerHTML = getDate();

    document.querySelector(".list-container").appendChild(div);
});

function getDate() {
    const d = new Date();
    const weekdays = ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"];
    return weekdays[d.getDay()];
}
let selectedDate = document.querySelector("#dateID");
document.querySelector(".addTaskBtn").addEventListener("click", ()=>{
    console.log(selectedDate.value);
    if(selectedDate.value == ""){
        console.log("Ange datum")
    }else{
        
        document.querySelector(".listSettings").classList.toggle("d-none");
    }
});

// function dNoneToggler(data){
//     document.querySelector(data.classList.toggle("d-none"));
// }