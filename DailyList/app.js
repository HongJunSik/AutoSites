// Application State
let todos = JSON.parse(localStorage.getItem('brutal_todos')) || [];
let currentFilter = 'all';

// DOM Elements
const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const categorySelect = document.getElementById('categorySelect');
const todoList = document.getElementById('todoList');
const emptyState = document.getElementById('emptyState');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const filterBtns = document.querySelectorAll('.filter-btn');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const appCard = document.getElementById('appCard');

// Category Badge Color Map
const categoryColors = {
  work: 'var(--color-rose)',
  life: 'var(--color-yellow)',
  study: 'var(--color-cyan)',
  health: 'var(--color-green)'
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  renderTodos();
  updateProgress();
  setup3DTilt();
  setupTheme();
});

// Theme Setup & Toggle
function setupTheme() {
  const savedTheme = localStorage.getItem('brutal_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('brutal_theme', newTheme);
    updateThemeIcon(newTheme);
    
    // Add brief active rotation effect to theme button
    themeToggle.style.transform = 'scale(0.8) rotate(180deg)';
    setTimeout(() => {
      themeToggle.style.transform = '';
    }, 200);
  });
}

function updateThemeIcon(theme) {
  if (theme === 'dark') {
    // Moon Icon SVG path
    themeIcon.innerHTML = `<path d="M12.3 22h-.1c-5.5 0-10-4.5-10-10C2.2 6.8 6.4 2.5 11.7 2c.3 0 .6.2.7.5.1.3 0 .6-.2.8-2.1 2.3-1.8 5.9.6 7.8 2.2 1.8 5.3 1.5 7.2-.6.2-.2.5-.3.8-.2.3.1.5.4.5.7-.7 5.2-5 9-10.3 9z"/>`;
  } else {
    // Sun Icon SVG path
    themeIcon.innerHTML = `<path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.02 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-12.37c-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41zm-12.37 12.37c-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41z"/>`;
  }
}

// 3D Tilt Effect on main card
function setup3DTilt() {
  let requestRef;
  let mouseX = 0;
  let mouseY = 0;
  let currentRotateX = 0;
  let currentRotateY = 0;
  
  const tiltLimit = 6; // Max rotation degrees
  const lerpFactor = 0.1; // Smoothness factor (spring effect)

  appCard.addEventListener('mousemove', (e) => {
    const rect = appCard.getBoundingClientRect();
    
    // Normalize mouse position between -0.5 and 0.5
    mouseX = (e.clientX - rect.left) / rect.width - 0.5;
    mouseY = (e.clientY - rect.top) / rect.height - 0.5;
  });

  appCard.addEventListener('mouseenter', () => {
    // Start animation loop
    cancelAnimationFrame(requestRef);
    requestRef = requestAnimationFrame(updateTilt);
  });

  appCard.addEventListener('mouseleave', () => {
    // Reset mouse variables
    mouseX = 0;
    mouseY = 0;
    
    // Continue loop until card returns to original position, then stop
    requestRef = requestAnimationFrame(updateTiltAndStop);
  });

  function updateTilt() {
    // Calculate target rotations
    const targetRotateX = -mouseY * tiltLimit * 2; // Invert Y axis for natural rotation
    const targetRotateY = mouseX * tiltLimit * 2;

    // Linear interpolation for smooth springy transition (lerp)
    currentRotateX += (targetRotateX - currentRotateX) * lerpFactor;
    currentRotateY += (targetRotateY - currentRotateY) * lerpFactor;

    appCard.style.transform = `rotateX(${currentRotateX.toFixed(2)}deg) rotateY(${currentRotateY.toFixed(2)}deg)`;
    
    requestRef = requestAnimationFrame(updateTilt);
  }

  function updateTiltAndStop() {
    currentRotateX += (0 - currentRotateX) * lerpFactor;
    currentRotateY += (0 - currentRotateY) * lerpFactor;

    appCard.style.transform = `rotateX(${currentRotateX.toFixed(2)}deg) rotateY(${currentRotateY.toFixed(2)}deg)`;

    // Stop animation loop if rotation is close enough to 0
    if (Math.abs(currentRotateX) < 0.05 && Math.abs(currentRotateY) < 0.05) {
      appCard.style.transform = 'rotateX(0deg) rotateY(0deg)';
      cancelAnimationFrame(requestRef);
    } else {
      requestRef = requestAnimationFrame(updateTiltAndStop);
    }
  }
}

// Add Todo Item
todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const text = todoInput.value.trim();
  const category = categorySelect.value;
  
  if (!text) return;
  
  const newTodo = {
    id: 'todo_' + Date.now(),
    text: text,
    completed: false,
    category: category
  };
  
  todos.push(newTodo);
  saveTodos();
  
  // Clear input
  todoInput.value = '';
  
  // Render & Update with creation animation
  renderTodos();
  updateProgress();
  
  // Animate newly added item
  const addedItem = document.getElementById(newTodo.id);
  if (addedItem) {
    addedItem.style.transform = 'translateY(20px) scale(0.95)';
    addedItem.style.opacity = '0';
    setTimeout(() => {
      addedItem.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
      addedItem.style.transform = '';
      addedItem.style.opacity = '1';
    }, 50);
  }
});

// Toggle and Delete Event Delegation
todoList.addEventListener('click', (e) => {
  const target = e.target;
  const todoItem = target.closest('.todo-item');
  if (!todoItem) return;
  
  const id = todoItem.id;
  const todoIndex = todos.findIndex(t => t.id === id);
  if (todoIndex === -1) return;
  
  // Delete Button Action
  if (target.closest('.delete-btn')) {
    // Play Bounce Out animation
    todoItem.style.transition = 'all 0.3s cubic-bezier(0.36, -0.07, 0.19, 0.97)';
    todoItem.style.transform = 'translateX(50px) scale(0.9)';
    todoItem.style.opacity = '0';
    
    setTimeout(() => {
      todos.splice(todoIndex, 1);
      saveTodos();
      renderTodos();
      updateProgress();
    }, 250);
  }
});

// Use Change event listener to avoid double-toggle behavior on label click
todoList.addEventListener('change', (e) => {
  const target = e.target;
  if (!target.classList.contains('todo-checkbox')) return;
  
  const todoItem = target.closest('.todo-item');
  if (!todoItem) return;
  
  const id = todoItem.id;
  const todoIndex = todos.findIndex(t => t.id === id);
  if (todoIndex === -1) return;
  
  todos[todoIndex].completed = target.checked;
  saveTodos();
  
  if (target.checked) {
    todoItem.classList.add('completed');
    // Subtle pop animation on check
    todoItem.style.transform = 'scale(0.98)';
    setTimeout(() => {
      todoItem.style.transform = '';
    }, 100);
  } else {
    todoItem.classList.remove('completed');
  }
  
  updateProgress();
});

// Filter Buttons Event Listeners
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    currentFilter = btn.dataset.filter;
    renderTodos();
  });
});

// Helper Functions
function saveTodos() {
  localStorage.setItem('brutal_todos', JSON.stringify(todos));
}

function updateProgress() {
  if (todos.length === 0) {
    progressBar.style.width = '0%';
    progressBar.style.backgroundColor = 'var(--color-rose)';
    progressText.style.color = 'var(--color-rose)';
    animateCounter(0);
    return;
  }
  
  const completedCount = todos.filter(t => t.completed).length;
  const percentage = Math.round((completedCount / todos.length) * 100);
  
  progressBar.style.width = `${percentage}%`;
  
  // Dynamically set progress bar color and text color based on percentage
  let activeColor = 'var(--color-rose)'; // 0% - 29%
  if (percentage >= 100) {
    activeColor = 'var(--color-green)'; // 100%
  } else if (percentage >= 70) {
    activeColor = 'var(--color-cyan)'; // 70% - 99%
  } else if (percentage >= 30) {
    activeColor = 'var(--color-orange)'; // 30% - 69%
  }
  
  progressBar.style.backgroundColor = activeColor;
  progressText.style.color = activeColor;
  
  animateCounter(percentage);
}

// Counting text animation for progress
let currentPercent = 0;
let counterAnimFrameId = null;

function animateCounter(targetValue) {
  if (counterAnimFrameId) {
    cancelAnimationFrame(counterAnimFrameId);
  }
  
  const startValue = currentPercent;
  if (startValue === targetValue) {
    progressText.textContent = `${targetValue}%`;
    return;
  }
  
  const duration = 400; // ms
  const startTime = performance.now();
  
  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease out quad
    const easeProgress = progress * (2 - progress);
    const currentValue = Math.round(startValue + (targetValue - startValue) * easeProgress);
    
    currentPercent = currentValue;
    progressText.textContent = `${currentValue}%`;
    
    if (progress < 1) {
      counterAnimFrameId = requestAnimationFrame(updateCounter);
    } else {
      currentPercent = targetValue;
      progressText.textContent = `${targetValue}%`;
      counterAnimFrameId = null;
    }
  }
  
  counterAnimFrameId = requestAnimationFrame(updateCounter);
}

function renderTodos() {
  todoList.innerHTML = '';
  
  const filteredTodos = todos.filter(t => {
    if (currentFilter === 'all') return true;
    return t.category === currentFilter;
  });
  
  if (filteredTodos.length === 0) {
    emptyState.style.display = 'flex';
    todoList.style.display = 'none';
    return;
  }
  
  emptyState.style.display = 'none';
  todoList.style.display = 'flex';
  
  filteredTodos.forEach(todo => {
    const item = document.createElement('li');
    item.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    item.id = todo.id;
    
    const badgeColor = categoryColors[todo.category] || 'gray';
    
    item.innerHTML = `
      <div class="todo-item-left">
        <label class="todo-checkbox-wrapper" aria-label="완료 체크">
          <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
          <span class="checkbox-visual"></span>
        </label>
        <span class="todo-text">${escapeHtml(todo.text)}</span>
      </div>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <span class="item-badge" style="background-color: ${badgeColor}; color: #000;">
          ${todo.category}
        </span>
        <button class="delete-btn" aria-label="할 일 삭제">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    `;
    
    todoList.appendChild(item);
  });
}

// XSS Prevention helper
function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
