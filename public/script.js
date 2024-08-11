const taskInput = document.getElementById("task-input");
const dateInput = document.getElementById("date-input");
const addButton = document.getElementById("add-button");
const editButton = document.getElementById("edit-button");
const alertMessage = document.getElementById("alert-message");
const todosBody = document.querySelector("tbody")
const deleteAllButton = document.getElementById("delete-all-button")
const filterbuttons = document.querySelectorAll(".filter-todos")

let todos = JSON.parse(localStorage.getItem("todos")) || [];

const generateId = () => {
    return Math.round(
        Math.random() * Math.random() * Math.pow(10, 15)
    ).toString();
}
const saveToLocalStorage = () => {
    localStorage.setItem("todos", JSON.stringify(todos))
}

const deleteAllHandler = () => {
    if (todos.length) {
        todos = [];
        saveToLocalStorage();
        displayTodos();
        showAlert("All todos deleted succesfully", "success")
    } else {
        showAlert("no todos  for deleting", "error")
    }
}

const showAlert = (message, type) => {
    alertMessage.innerHTML = "";
    const alert = document.createElement("p");
    alert.innerText = message;
    alert.classList.add(
        "w-full",
        "p-2",
        "rounded-lg",
        "text-center",
        type === "success" ? "bg-green-200" : "bg-red-200",
        type === "success" ? "text-green-700" : "text-red-700"
    )

    alertMessage.append(alert);
    setTimeout(() => {
        alert.style.display = "none";
    }, 2000)
}

const displayTodos = () => {
    todosBody.innerHTML = "";
    if (!todos.length) {
        todosBody.innerHTML = "<tr><td colspan='4'>No Task Found</td></tr>"
        return;
    }

    todos.forEach(todo => {
        todosBody.innerHTML += `
        <tr>
            <td>${todo.task}</td> 
            <td>${todo.date || 'No Date'}</td>
            <td>${todo.completed ? 'completed' : "pending"}</td>
            <td>
                <button onclick="editHandler('${todo.id}')">Edit</button>
                <button onclick="toggleHandler('${todo.id}')">
                    ${todo.completed ? "Undo" : "Do"}
                </button>
                <button onclick="deletHandler('${todo.id}')">Delete</button>
            </td>
        </tr>
        `
    });
};



const addHandler = () => {
    const task = taskInput.value;
    const date = dateInput.value;
    const todo = {
        id: generateId(),
        completed: false,
        task,
        date,
    };
    if (task) {
        todos.push(todo);
        saveToLocalStorage();
        displayTodos();
        taskInput.value = ""
        dateInput.value = ""
        showAlert("todo added succesfully", "success")
    } else {
        showAlert("please Enter Todo!", "error")
    }
}

const deletHandler = (id) => {
    const newTodos = todos.filter(todo => todo.id !== id)
    todos = newTodos;
    showAlert("todo deleted succesfully", "success")
    saveToLocalStorage();
    displayTodos();
}

const toggleHandler = (id) => {
    const todo = todos.find(todo => todo.id === id);
    todo.completed = !todo.completed;
    saveToLocalStorage()
    displayTodos()
    showAlert("todo deleted successfully", "success")
}

const editHandler = (id) => {
    const todo = todos.find(todo => todo.id === id);
    taskInput.value = todo.task;
    dateInput.value = todo.date;
    addButton.classList.add("hidden");
    editButton.classList.remove("hidden");
    editButton.dataset.id = id;
}

const applyEditHandler = (event) => {
    const id = event.target.dataset.id;
    const todo = todos.find((todo) => todo.id === id);
    todo.task = taskInput.value;
    todo.date = dateInput.value
    taskInput.value = "";
    dateInput.value = "";
    addButton.classList.remove("hidden")
    editButton.classList.add("hidden")
    saveToLocalStorage()
    displayTodos()
    showAlert("Todo edited succesfully", "success")
}

const filterHandler = (event) => {
    const filter = event.target.dataset.filter;
    
}

window.addEventListener("load", displayTodos)
addButton.addEventListener("click", addHandler);
deleteAllButton.addEventListener("click", deleteAllHandler);
editButton.addEventListener("click", applyEditHandler)
filterbuttons.forEach((button) => {
    button.addEventListener("click", filterHandler)
});