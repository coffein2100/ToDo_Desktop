//Находим элементы на странице
const form = document.querySelector('#form');
const form2 = document.querySelector('#form2');
const taskInput = document.querySelector('#taskInput');
const taskListTable = document.querySelector('#tasksListTable');
const taskList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');
const taskCategoryNew = document.querySelector('#taskInputCategory'); // добавляем новую категорию
const taskCategorySelect = document.querySelector('#taskCategory');//выбранная категория
const taskCategorySelectDelete = document.querySelector('#taskCategoryDelete');//выбранная категория для удаления
const deadLine = document.querySelector('#taskInputdate');
const formDeleteCategory = document.querySelector('#formDeleteCategory');

let tasks = [];
let tasksCategory = [];

if(localStorage.getItem('tasks')){
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach((task) => renderTask (task));
}
if(localStorage.getItem('tasksCategory')){
    tasksCategory = JSON.parse(localStorage.getItem('tasksCategory'));
    tasksCategory.forEach((tasksCat) => renderTaskCategory (tasksCat));
}

checkEmptyList();
//добавление задачи
form.addEventListener('submit', addTask);
//добавление категории задачи
form2.addEventListener('submit', createTaskCategory);

//удаление задачи

taskListTable.addEventListener('click', deleteTask);
//удаление категории

formDeleteCategory.addEventListener('submit', deleteCategory);

//отмечаем задачу завершенной

taskListTable.addEventListener('click', doneTask);

function addTask (event) {
    event.preventDefault(); //отменить перезагрузку страницы и отправку формы 

   //Считываем текст задачи из поля ввода  
   const taskText =  taskInput.value;

   const parse  = Date.parse(deadLine.value);
   let taskend = new Date(parse).toLocaleDateString();
   let taskCategory=taskCategorySelect.value;
   //описываем задачу в виде объекта
    const newTask = {
        id: Date.now(),
        text:taskText,
        category: taskCategory,
        endTime:taskend,
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
        const parenNode = event.target.closest('tr');

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
        const parentNode = event.target.closest('tr');

        const id = parentNode.id;

        const task = tasks.find((task) => task.id == id);

        task.status = !task.status;
        saveToLocalStorage();
        // const taskTitle = parentNode.querySelector('.task-title');
        const taskTitle = parentNode;
        taskTitle.classList.toggle('table-success');
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
function saveToLocalStorageCategory() {
    localStorage.setItem('tasksCategory', JSON.stringify(tasksCategory));
}

function renderTask (task) {
    const taskHTML = `<tr class="" id="${task.id}">
    <td class="task-title">${task.text}</td>
    <td class="task-title">${task.category}</td>
    <td class="task-title">${task.endTime}</td>
    <td class="task-titlebutton">
        <button type="button" data-action="done" class="btn-action">
            <img src="./img/tick.svg" alt="Done" width="18" height="18">
        </button>
    </td>
    <td class="task-titlebutton">
        <button type="button" data-action="delete" class="btn-action">
            <img src="./img/cross.svg" alt="Done" width="18" height="18">
        </button>
    </td>`;
     //Добавляем задачу на страницу
     taskListTable.insertAdjacentHTML('beforeend', taskHTML);
}

function createTaskCategory(event){
    event.preventDefault();
    const taskCategoryInput = taskCategoryNew.value;
    let countcategoryname = 0;
    let check = tasksCategory.forEach((Category)=> {
       if (Category.text.toLowerCase() == taskCategoryInput.toLowerCase())
       {countcategoryname = countcategoryname + 1;}
    });
    console.log(countcategoryname);

    if (countcategoryname > 0 ) {
        alert('Данная категория уже есть.\nПросьба ввести другое название категории')
    } else {
    //описываем категорию в виде объекта
    const newCategory = {
        id:Date.now(),
        text:taskCategoryInput,
    }
    tasksCategory.push(newCategory);
    saveToLocalStorageCategory();
    taskCategoryNew.value='';
    renderTaskCategory (newCategory);
    }
}

function renderTaskCategory (tasksCat){
    //Формируем разметку для категорий задач
    const taskHTMLCategory = `<option value="${tasksCat.text}">${tasksCat.text}</option>`;
    taskCategorySelect.insertAdjacentHTML('beforeend', taskHTMLCategory);
    taskCategorySelectDelete.insertAdjacentHTML('beforeend', taskHTMLCategory);
}

function deleteCategory(event){
    event.preventDefault();
    const taskCategoryInputDelete = String(taskCategorySelectDelete.value);
    console.log(taskCategoryInputDelete);
    tasksCategory = tasksCategory.filter((tasksCat) => tasksCat.text !== taskCategoryInputDelete);
    saveToLocalStorageCategory();   

    let selectedIndex = taskCategorySelectDelete.options.selectedIndex;
    // удаляем элемент 
    taskCategorySelect.remove(selectedIndex);
    taskCategorySelectDelete.remove(selectedIndex);

}