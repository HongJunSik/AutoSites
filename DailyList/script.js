import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
  deleteUser
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  updateDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  writeBatch,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ==========================================
// ⚠️ FIREBASE CONFIGURATION (사용자 설정 정보 보존)
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyCOOs7o1OLxu9eNlbG_1d_r4KRC-4M1pOs",
  authDomain: "todolist-e1e11.firebaseapp.com",
  projectId: "todolist-e1e11",
  storageBucket: "todolist-e1e11.appspot.com",
  messagingSenderId: "569438063385",
  appId: "1:569438063385:web:5d2e0fccf9976378e907d4"
};

// ==========================================
// INITIALIZE FIREBASE
// ==========================================
let app, auth, db;
let isFirebaseInitialized = false;

try {
  if (firebaseConfig.apiKey !== "YOUR_API_KEY_HERE") {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    isFirebaseInitialized = true;
  }
} catch (error) {
  console.error("Firebase 초기화 중 에러 발생:", error);
}

// Application State
let currentUser = null;
let todos = [];
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

// Authentication DOM Elements
const authSection = document.getElementById('authSection');
const todoSection = document.getElementById('todoSection');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const goToRegisterBtn = document.getElementById('goToRegister');
const goToLoginBtn = document.getElementById('goToLogin');
const logoutBtn = document.getElementById('logoutBtn');
const userTodoTitle = document.getElementById('userTodoTitle');
const authSubtitle = document.getElementById('authSubtitle');
const loadingOverlay = document.getElementById('loadingOverlay');
const currentDateEl = document.getElementById('current-date');

// Category Badge Color Map (Original)
const categoryColors = {
  work: 'var(--color-rose)',
  life: 'var(--color-yellow)',
  study: 'var(--color-cyan)',
  health: 'var(--color-green)'
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  setupTheme();
  setup3DTilt();
  
  // Set current date badge
  setCurrentDate();
  
  // Firebase 미설정 상태 대응
  if (!isFirebaseInitialized) {
    showFirebaseSetupWarning();
    return;
  }

  // Setup Firebase Auth listener
  showLoading(true);
  onAuthStateChanged(auth, async (user) => {
    const userBadge = document.getElementById('userBadge');
    if (user) {
      currentUser = user;
      
      const finalNickname = user.displayName || '당신의 닉네임';
      
      // Update subtitle to personal nickname
      const subtitleEl = todoSection.querySelector('.app-subtitle');
      if (subtitleEl) {
        subtitleEl.textContent = `${finalNickname}의 오늘 할 일 체크리스트`;
      }

      // Show floating user badge with nickname
      if (userBadge) {
        userBadge.textContent = `👤 ${finalNickname}`;
        userBadge.classList.remove('hidden-badge');
      }

      // Load todos from firestore
      await fetchTodosFromFirestore();
      
      // View transition to app
      authSection.classList.add('hidden-section');
      todoSection.classList.remove('hidden-section');
    } else {
      currentUser = null;
      todos = [];
      
      if (userBadge) {
        userBadge.classList.add('hidden-badge');
      }

      todoSection.classList.add('hidden-section');
      authSection.classList.remove('hidden-section');
    }
    showLoading(false);
  });

  // Auth Layout Switching
  goToRegisterBtn.addEventListener('click', () => {
    loginForm.classList.add('hidden-form');
    registerForm.classList.remove('hidden-form');
  });

  goToLoginBtn.addEventListener('click', () => {
    registerForm.classList.add('hidden-form');
    loginForm.classList.remove('hidden-form');
  });

  // Auth Operations
  loginForm.addEventListener('submit', handleLogin);
  registerForm.addEventListener('submit', handleRegister);
  logoutBtn.addEventListener('click', handleLogout);
  
  const deleteAccountBtn = document.getElementById('deleteAccountBtn');
  if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener('click', handleDeleteAccount);
  }

  // Todo Operations (Original event bindings)
  todoForm.addEventListener('submit', handleAddTodo);
  setupTodoActions();
  setupFilters();
  setupPasswordToggle();
});

// ==========================================
// FIREBASE AUTHENTICATION LOGIC
// ==========================================

// 가상 이메일 생성기 (id@dailylist.local 형태로 Auth 매핑)
function mapUsernameToEmail(username) {
  return `${username.trim().toLowerCase()}@dailylist.local`;
}

// 로그인 (아이디/비밀번호 에러 구분용 사전조회 쿼리 결합)
async function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;

  if (!username || !password) return;

  showLoading(true);
  try {
    // 1. 아이디 존재 여부 사전 쿼리 검사 (대소문자 무관)
    const usersRef = collection(db, "users");
    const usernameQuery = query(usersRef, where("username", "==", username.toLowerCase()));
    const querySnapshot = await getDocs(usernameQuery);
    
    if (querySnapshot.empty) {
      alert('아이디를 확인해주세요 ^^');
      showLoading(false);
      return;
    }

    // 2. 아이디가 존재할 경우에만 로그인 인증 시도
    const email = mapUsernameToEmail(username);
    await signInWithEmailAndPassword(auth, email, password);
    loginForm.reset();
  } catch (error) {
    console.error("로그인 실패:", error);
    // 아이디가 이미 존재함이 검증되었으므로, 여기서 실패하면 비밀번호가 틀린 것임
    alert('비밀번호를 확인해주세요 ^^');
  } finally {
    showLoading(false);
  }
}

// 회원가입
async function handleRegister(e) {
  e.preventDefault();
  const username = document.getElementById('register-username').value;
  const nickname = document.getElementById('register-nickname').value;
  const password = document.getElementById('register-password').value;

  const trimmedUsername = username.trim();
  const trimmedNickname = nickname.trim();

  // 1. 아이디 공백/특수문자 체크
  const usernameRegex = /^[a-zA-Z0-9]+$/;
  if (!trimmedUsername || !usernameRegex.test(trimmedUsername) || username.includes(' ')) {
    alert('아이디에 특수문자나 공백이 포함될 순 없습니다^^');
    return;
  }

  // 2. 닉네임 미입력 및 공백 체크
  if (!trimmedNickname) {
    alert('닉네임이 입력되지 않았습니다^^');
    return;
  }

  // 3. 닉네임 8자 초과 체크
  if (trimmedNickname.length > 8) {
    alert('닉네임은 최대 8자 입니다^^');
    return;
  }

  // 4. 비밀번호 규칙 검증
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
  if (!passwordRegex.test(password)) {
    alert('비밀번호를 규칙에 맞게 설정해주세요^^\n\n[비밀번호 규칙]\n- 최소 8자 이상\n- 영문 대소문자, 숫자, 특수문자(@$!%*?&#) 각각 1개 이상 필수 혼용');
    return;
  }

  showLoading(true);
  try {
    // 5. 닉네임 중복 체크 (Firestore '/users' 쿼리 조회)
    const usersRef = collection(db, "users");
    const nicknameQuery = query(usersRef, where("nickname", "==", trimmedNickname));
    const querySnapshot = await getDocs(nicknameQuery);
    if (!querySnapshot.empty) {
      alert('사용중인 닉네임입니다^^');
      showLoading(false);
      return;
    }

    const email = mapUsernameToEmail(trimmedUsername);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Auth Profile에 닉네임 연동
    await updateProfile(userCredential.user, {
      displayName: trimmedNickname
    });

    // Firestore '/users/{uid}' 에 프로필 등록
    await setDoc(doc(db, "users", userCredential.user.uid), {
      username: trimmedUsername.toLowerCase(),
      nickname: trimmedNickname,
      createdAt: Date.now()
    });
    
    alert("회원가입이 완료되었습니다!");
    window.location.reload();
  } catch (error) {
    console.error("회원가입 실패:", error);
    let errorMsg = "회원가입에 실패했습니다.";
    if (error.code === 'auth/email-already-in-use') {
      errorMsg = "이미 존재하는 아이디입니다.";
    } else if (error.code === 'auth/weak-password') {
      errorMsg = "비밀번호 보안 수준이 약합니다.";
    } else if (error.code === 'auth/configuration-not-found') {
      errorMsg = "Firebase Authentication에서 '이메일/비밀번호' 로그인 제공업체가 활성화되지 않았습니다. Firebase 콘솔 설정을 확인해 주세요.";
    }
    alert(`${errorMsg}\n\n[상세 에러 정보]\n코드: ${error.code}\n메시지: ${error.message}`);
  } finally {
    showLoading(false);
  }
}

// 로그아웃
async function handleLogout() {
  showLoading(true);
  try {
    await signOut(auth);
  } catch (error) {
    console.error("로그아웃 실패:", error);
    alert("로그아웃에 실패했습니다.");
  } finally {
    showLoading(false);
  }
}

// 계정 영구 삭제 (회원 탈퇴 및 개인정보 완전 파기)
async function handleDeleteAccount() {
  if (!currentUser) return;

  const password = prompt("보안 및 본인 확인을 위해 비밀번호를 입력해주세요 ^^");
  if (password === null) return; // 취소 버튼 클릭 시 종료
  if (password.trim() === "") {
    alert("비밀번호가 입력되지 않았습니다 ^^");
    return;
  }

  showLoading(true);
  try {
    // 1. 보안 재인증 (Re-authentication)
    const credential = EmailAuthProvider.credential(currentUser.email, password);
    await reauthenticateWithCredential(currentUser, credential);

    // 2. Firestore 개인 데이터 일괄 영구 삭제 (Batch commit)
    const batch = writeBatch(db);
    
    // 2-1. 할 일 리스트 전체 삭제
    const todosRef = collection(db, "users", currentUser.uid, "todos");
    const todosSnapshot = await getDocs(todosRef);
    todosSnapshot.forEach((todoDoc) => {
      batch.delete(todoDoc.ref);
    });

    // 2-2. 사용자 프로필(닉네임 인덱스) 삭제
    const userDocRef = doc(db, "users", currentUser.uid);
    batch.delete(userDocRef);

    // 삭제 실행
    await batch.commit();

    // 3. Firebase Auth 계정 삭제
    await deleteUser(currentUser);

    alert("계정이 성공적으로 삭제되었습니다 ^^");
    window.location.reload();
  } catch (error) {
    console.error("계정 삭제 실패:", error);
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
      alert("비밀번호가 일치하지 않습니다 ^^");
    } else {
      alert(`계정 삭제 처리 중 오류가 발생했습니다.\n\n[에러 코드: ${error.code}]`);
    }
  } finally {
    showLoading(false);
  }
}

// 비밀번호 표시/숨김 눈동자 버튼 토글 바인딩
function setupPasswordToggle() {
  const toggleBtns = document.querySelectorAll('.password-toggle-btn');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (!input) return;
      
      if (input.type === 'password') {
        input.type = 'text';
        // Eye Open Icon
        btn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        `;
      } else {
        input.type = 'password';
        // Eye Close Icon
        btn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
          </svg>
        `;
      }
    });
  });
}

// ==========================================
// FIRESTORE DATABASE LOGIC (CRUD)
// ==========================================

// 데이터 로드
async function fetchTodosFromFirestore() {
  if (!currentUser) return;
  
  try {
    const todosRef = collection(db, "users", currentUser.uid, "todos");
    const q = query(todosRef, orderBy("createdAt", "asc"));
    const querySnapshot = await getDocs(q);
    
    todos = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      todos.push({
        id: doc.id,
        text: data.text,
        completed: data.completed,
        category: data.category || 'work',
        createdAt: data.createdAt || Date.now()
      });
    });
    
    renderTodos();
    updateProgress();
  } catch (error) {
    console.error("데이터 로드 에러:", error);
    alert("데일리리스트를 가져오는 중 오류가 발생했습니다.");
  }
}

// 할 일 추가 (Original app.js logic adapted to Firestore)
async function handleAddTodo(e) {
  e.preventDefault();
  
  const text = todoInput.value.trim();
  const category = categorySelect.value;
  
  if (!text) return;
  
  showLoading(true);
  try {
    const todosRef = collection(db, "users", currentUser.uid, "todos");
    const newTodoData = {
      text: text,
      completed: false,
      category: category,
      createdAt: Date.now()
    };
    
    const docRef = await addDoc(todosRef, newTodoData);
    
    const newTodo = {
      id: docRef.id,
      text: text,
      completed: false,
      category: category,
      createdAt: newTodoData.createdAt
    };
    
    todos.push(newTodo);
    
    // Clear input
    todoInput.value = '';
    
    // Render & Update
    renderTodos();
    updateProgress();
    
    // Animate newly added item (Original bounce in animation)
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
  } catch (error) {
    console.error("할 일 추가 에러:", error);
    alert("할 일을 등록하지 못했습니다.");
  } finally {
    showLoading(false);
  }
}

// Toggle 및 Delete 이벤트 델리게이션 세팅 (Original Logic adapted)
function setupTodoActions() {
  todoList.addEventListener('click', async (e) => {
    const target = e.target;
    const todoItem = target.closest('.todo-item');
    if (!todoItem) return;
    
    const id = todoItem.id;
    const todoIndex = todos.findIndex(t => t.id === id);
    if (todoIndex === -1) return;
    
    // Delete Button Action
    if (target.closest('.delete-btn')) {
      showLoading(true);
      try {
        const todoDocRef = doc(db, "users", currentUser.uid, "todos", id);
        await deleteDoc(todoDocRef);
        
        // Play Bounce Out animation
        todoItem.style.transition = 'all 0.3s cubic-bezier(0.36, -0.07, 0.19, 0.97)';
        todoItem.style.transform = 'translateX(50px) scale(0.9)';
        todoItem.style.opacity = '0';
        
        setTimeout(() => {
          todos.splice(todoIndex, 1);
          renderTodos();
          updateProgress();
        }, 250);
      } catch (error) {
        console.error("할 일 삭제 에러:", error);
        alert("할 일을 삭제하지 못했습니다.");
      } finally {
        showLoading(false);
      }
    }
  });

  // Use Change event listener to avoid double-toggle behavior on label click
  todoList.addEventListener('change', async (e) => {
    const target = e.target;
    if (!target.classList.contains('todo-checkbox')) return;
    
    const todoItem = target.closest('.todo-item');
    if (!todoItem) return;
    
    const id = todoItem.id;
    const todoIndex = todos.findIndex(t => t.id === id);
    if (todoIndex === -1) return;
    
    const nextCompletedState = target.checked;
    
    showLoading(true);
    try {
      const todoDocRef = doc(db, "users", currentUser.uid, "todos", id);
      await updateDoc(todoDocRef, {
        completed: nextCompletedState
      });
      
      todos[todoIndex].completed = nextCompletedState;
      
      if (nextCompletedState) {
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
    } catch (error) {
      console.error("상태 변경 실패:", error);
      alert("상태 수정 중 오류가 발생했습니다.");
      target.checked = !nextCompletedState; // revert checkbox
    } finally {
      showLoading(false);
    }
  });
}

// 필터 버튼 제어 (Original)
function setupFilters() {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      currentFilter = btn.dataset.filter;
      renderTodos();
    });
  });
}

// ==========================================
// ORIGINAL HELPERS & THEME & TILT (Original app.js)
// ==========================================

// Theme Setup & Toggle (Original)
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
    themeIcon.innerHTML = `<path d="M12.3 22h-.1c-5.5 0-10-4.5-10-10C2.2 6.8 6.4 2.5 11.7 2c.3 0 .6.2.7.5.1.3 0 .6-.2.8-2.1 2.3-1.8 5.9.6 7.8 2.2 1.8 5.3 1.5 7.2-.6.2-.2.5-.3.8-.2.3.1.5.4.5.7-.7 5.2-5 9-10.3 9z"/>`;
  } else {
    themeIcon.innerHTML = `<path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.02 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-12.37c-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41zm-12.37 12.37c-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41z"/>`;
  }
}

// 3D Tilt Effect on main card (Original)
function setup3DTilt() {
  let requestRef;
  let mouseX = 0;
  let mouseY = 0;
  let currentRotateX = 0;
  let currentRotateY = 0;
  
  const tiltLimit = 6; 
  const lerpFactor = 0.1; 

  appCard.addEventListener('mousemove', (e) => {
    const rect = appCard.getBoundingClientRect();
    mouseX = (e.clientX - rect.left) / rect.width - 0.5;
    mouseY = (e.clientY - rect.top) / rect.height - 0.5;
  });

  appCard.addEventListener('mouseenter', () => {
    cancelAnimationFrame(requestRef);
    requestRef = requestAnimationFrame(updateTilt);
  });

  appCard.addEventListener('mouseleave', () => {
    mouseX = 0;
    mouseY = 0;
    requestRef = requestAnimationFrame(updateTiltAndStop);
  });

  function updateTilt() {
    const targetRotateX = -mouseY * tiltLimit * 2; 
    const targetRotateY = mouseX * tiltLimit * 2;

    currentRotateX += (targetRotateX - currentRotateX) * lerpFactor;
    currentRotateY += (targetRotateY - currentRotateY) * lerpFactor;

    appCard.style.transform = `rotateX(${currentRotateX.toFixed(2)}deg) rotateY(${currentRotateY.toFixed(2)}deg)`;
    requestRef = requestAnimationFrame(updateTilt);
  }

  function updateTiltAndStop() {
    currentRotateX += (0 - currentRotateX) * lerpFactor;
    currentRotateY += (0 - currentRotateY) * lerpFactor;

    appCard.style.transform = `rotateX(${currentRotateX.toFixed(2)}deg) rotateY(${currentRotateY.toFixed(2)}deg)`;

    if (Math.abs(currentRotateX) < 0.05 && Math.abs(currentRotateY) < 0.05) {
      appCard.style.transform = 'rotateX(0deg) rotateY(0deg)';
      cancelAnimationFrame(requestRef);
    } else {
      requestRef = requestAnimationFrame(updateTiltAndStop);
    }
  }
}

// Update progress bar percentage (Original with counting animations)
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
  
  let activeColor = 'var(--color-rose)'; 
  if (percentage >= 100) {
    activeColor = 'var(--color-green)'; 
  } else if (percentage >= 70) {
    activeColor = 'var(--color-cyan)'; 
  } else if (percentage >= 30) {
    activeColor = 'var(--color-orange)'; 
  }
  
  progressBar.style.backgroundColor = activeColor;
  progressText.style.color = activeColor;
  
  animateCounter(percentage);
}

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
  
  const duration = 400; 
  const startTime = performance.now();
  
  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
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

// Helper to format date as MM.DD (e.g. 07.11)
function formatDate(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}.${day}`;
}

// Render Todo items (Original)
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
    const dateText = formatDate(todo.createdAt);
    
    item.innerHTML = `
      <div class="todo-item-left">
        <label class="todo-checkbox-wrapper" aria-label="완료 체크">
          <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
          <span class="checkbox-visual"></span>
        </label>
        <span class="todo-text">${escapeHtml(todo.text)}</span>
      </div>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        ${dateText ? `<span class="todo-date-badge">${dateText}</span>` : ''}
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

// Set Date formatted beautifully for header badge
function setCurrentDate() {
  if (!currentDateEl) return;
  const today = new Date();
  const options = { 
    month: 'short', 
    day: 'numeric', 
    weekday: 'short' 
  };
  currentDateEl.textContent = today.toLocaleDateString('ko-KR', options);
}

// Show/Hide Spinner (Null-safe Guarded)
function showLoading(show) {
  const overlay = document.getElementById('loadingOverlay');
  if (!overlay) return;
  if (show) {
    overlay.classList.add('active');
  } else {
    overlay.classList.remove('active');
  }
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

// Firebase Warning
function showFirebaseSetupWarning() {
  authSection.innerHTML = `
    <header class="app-header">
      <h1 class="app-title" style="background-color: var(--color-rose);">설정 필요</h1>
      <p class="app-subtitle" style="margin-top: 15px; font-size: 0.85rem;">
        script.js에 Firebase Config를 기입해 주세요.
      </p>
    </header>
  `;
}
