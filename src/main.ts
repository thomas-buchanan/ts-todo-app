import "./styles.css";

import { Todo } from "./todo";
import Sortable from "sortablejs";

let todos: Todo[] = loadTodos();

const form = document.querySelector("#todo-form") as HTMLFormElement;
const input = document.querySelector("#todo-input") as HTMLInputElement;
const list = document.querySelector("#todo-list") as HTMLUListElement;

type Filter = "all" | "active" | "completed";
let currentFilter: Filter = "all";

renderTodos();

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  // Create new Todo
  const newTodo = new Todo(Date.now(), text);
  todos.push(newTodo);

  input.value = "";
  saveTodos();
  renderTodos();
});

function renderTodos() {
  list.innerHTML = "";

  let filtered = todos;
  if (currentFilter === "active") {
    filtered = todos.filter((t) => !t.completed);
  } else if (currentFilter === "completed") {
    filtered = todos.filter((t) => t.completed);
  }

  filtered.forEach((todo) => {
    const li = document.createElement("li");

    li.className =
      "flex items-center justify-between p-3 bg-white rounded shadow-sm border border-gray-100 mb-1 hover:border-gray-300 transition";
    li.dataset.id = String(todo.id);

    const label = document.createElement("label");
    label.className = "flex items-center gap-2 flex-1";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.className = "form-checkbox w-5 h-5 text-blue-500";

    const span = document.createElement("span");
    span.textContent = todo.text;
    span.className = todo.completed
      ? "line-through text-gray-400"
      : "text-gray-800";

    // Toggle complete
    checkbox.addEventListener("change", () => {
      todo.completed = checkbox.checked;
      saveTodos();
      renderTodos();
    });

    label.appendChild(checkbox);
    label.appendChild(span);

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑";
    deleteBtn.title = "Delete todo";
    deleteBtn.className = "ml-2 text-red-500 hover:text-red-600 transition";

    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // prevent triggering complete toggle
      const index = todos.findIndex((t) => t.id === todo.id);
      todos.splice(index, 1);
      saveTodos();
      renderTodos();
    });

    li.appendChild(label);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function loadTodos(): Todo[] {
  const todosJson = localStorage.getItem("todos");
  if (!todosJson) return [];

  const parsed = JSON.parse(todosJson);
  // Convert plain objects into class instances
  return parsed.map((t: any) => new Todo(t.id, t.text, t.completed));
}

const filterButtons =
  document.querySelectorAll<HTMLButtonElement>("#filters button");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.getAttribute("data-filter") as Filter;
    currentFilter = value;
    updateFilterStyles(button);
    renderTodos();
  });
});

function updateFilterStyles(activeButton: HTMLButtonElement) {
  filterButtons.forEach((btn) => {
    btn.classList.remove("bg-blue-500", "text-white");
    btn.classList.add("bg-white", "text-gray-700");
  });

  activeButton.classList.remove("bg-white", "text-gray-700");
  activeButton.classList.add("bg-blue-500", "text-white");
}

const sortable = new Sortable(list, {
  animation: 150,
  onEnd: () => {
    // Rebuild the todos array based on the new DOM order
    const newOrder: Todo[] = [];
    const items = list.querySelectorAll("li");

    items.forEach((li) => {
      const id = parseInt(li.dataset.id!);
      const todo = todos.find((t) => t.id === id);
      if (todo) newOrder.push(todo);
    });

    todos = newOrder;
    saveTodos();
  },
});
