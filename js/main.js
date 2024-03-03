//Находим элементы на странице
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const taskList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

if(localStorage.getItem('tasks')){
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach((task) => renderTask (task));
}



checkEmptyList();
//добавление задачи
form.addEventListener('submit', addTask);

//удаление задачи

taskList.addEventListener('click', deleteTask);

//отмечаем задачу завершенной

taskList.addEventListener('click', doneTask);

function addTask (event) {
    event.preventDefault(); //отменить перезагрузку страницы и отправку формы 

   //Считываем текст задачи из поля ввода  
   const taskText =  taskInput.value;
   
   //описываем задачу в виде объекта
    const newTask = {
        id: Date.now(),
        text:taskText,
        status:false,
    };
    //добавляем задачу в массив
    tasks.push(newTask);
    saveToLocalStorage();

    renderTask (newTask);
//очищаем поля ввода и возвращаем фокус
taskInput.value = "";
taskInput.focus();
checkEmptyList();

}

function deleteTask(event){
    if(event.target.dataset.action !== 'delete') return;
        const parenNode = event.target.closest('.list-group-item');

        //определяем id задачи
        const id = Number(parenNode.id);
        //фильтруем массив без задачи
        tasks = tasks.filter((task) => task.id !== id);
        saveToLocalStorage();
        parenNode.remove();
        checkEmptyList();
}

function doneTask (event){
  //Проверяем что клик был по кнопке завершить задачу  
    if (event.target.dataset.action === "done"){
        const parentNode = event.target.closest('.list-group-item');

        const id = parentNode.id;

        const task = tasks.find((task) => task.id == id);

        task.status = !task.status;
        saveToLocalStorage();
        const taskTitle = parentNode.querySelector('.task-title');
        taskTitle.classList.toggle('task-title--done');
    }
}

function checkEmptyList() {
    if (tasks.length == 0) {
        const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
        <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
        <div class="empty-list__title">Список дел пуст</div>
    </li>`;
    taskList.insertAdjacentHTML('afterbegin', emptyListHTML);
    }
    if (tasks.length > 0){
       const emptyListEl = document.querySelector('#emptyList'); 
       emptyListEl ? emptyListEl.remove() : null;
    }
}
function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask (task) {
        //формируем CSS класс
        const cssClass = task.status ? "task-title task-title--done" : "task-title";

        //Формируем разметку для новой задачи
         const taskHTML = `
         <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
         <span class="${cssClass}">${task.text}</span>
         <div class="task-item__buttons">
             <button type="button" data-action="done" class="btn-action">
                 <img src="./img/tick.svg" alt="Done" width="18" height="18">
             </button>
             <button type="button" data-action="delete" class="btn-action">
                 <img src="./img/cross.svg" alt="Done" width="18" height="18">
             </button>
         </div>
     </li>`;
     
     //Добавляем задачу на страницу
     taskList.insertAdjacentHTML('beforeend', taskHTML);
}