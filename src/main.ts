import type { Todo } from "./todo";

const todos: Todo[] = loadTodos();

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
    li.style.textDecoration = todo.completed ? 'line-through' : 'none';

    // Toggle complete
    li.addEventListener('click', () => {
      todo.completed = !todo.completed;
      saveTodos();
      renderTodos();
    });

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑️';
    deleteBtn.style.marginLeft = '1rem';
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent triggering complete toggle
      const index = todos.findIndex((t) => t.id === todo.id);
      todos.splice(index, 1);
      saveTodos();
      renderTodos();
    });

    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodos(): Todo[] {
  const todosJson = localStorage.getItem('todos');
  return todosJson ? JSON.parse(todosJson) : [];
}