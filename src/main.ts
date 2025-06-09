import type { Todo } from "./todo";

const todos: Todo[] = [];

const form = document.querySelector('#todo-form') as HTMLFormElement;
const input = document.querySelector('#todo-input') as HTMLInputElement;
const list = document.querySelector('#todo-list') as HTMLUListElement;

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  const newTodo: Todo = {
    id: Date.now(),
    text,
    completed: false
  };

  todos.push(newTodo);
  input.value = '';
  renderTodos();
});

function renderTodos() {
  list.innerHTML = '';
  todos.forEach((todo) => {
    const li = document.createElement('li');
    li.textContent = todo.text;
    list.appendChild(li);
  });
}