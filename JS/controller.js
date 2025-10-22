import model from './model.js';
import view from './view.js';

export default {
    init(){
        window.onload = view.resetInputs;
        view.initEventListeners();
        model.createJSON();
        view.loadListsFromLocalStorage();
    },
    handleCreateNewList(){

    },
    handleListInputKeydown(e){

    },
    handleDateChange(e){

    },
    handleTaskInputEnter(event){

    }
}