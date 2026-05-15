export interface User {
  email: string;
  name: string;
  password: string;
}

const USERS_KEY = 'app_users';
const SESSION_KEY = 'app_session';

const seedUsers: User[] = [
  { email: 'admin@example.com', name: 'Admin', password: '123456' },
  { email: 'user@example.com', name: 'Usuario Demo', password: 'password' },
];

function getUsers(): User[] {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) {
    localStorage.setItem(USERS_KEY, JSON.stringify(seedUsers));
    return seedUsers;
  }
  return JSON.parse(raw);
}

function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function login(email: string, password: string): User {
  const user = getUsers().find((u) => u.email === email && u.password === password);
  if (!user) throw new Error('Email o contraseña incorrectos');
  localStorage.setItem(SESSION_KEY, JSON.stringify({ email: user.email, name: user.name }));
  return user;
}

export function signup(name: string, email: string, password: string): User {
  const users = getUsers();
  if (users.some((u) => u.email === email)) {
    throw new Error('Ese email ya está registrado');
  }
  const newUser: User = { name, email, password };
  users.push(newUser);
  saveUsers(users);
  localStorage.setItem(SESSION_KEY, JSON.stringify({ email, name }));
  return newUser;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser(): { email: string; name: string } | null {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}
