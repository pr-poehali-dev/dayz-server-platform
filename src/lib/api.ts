// API клиент для всех бэкенд-функций
const URLS = {
  auth: 'https://functions.poehali.dev/9d8fd37a-cf41-425e-8baf-f55af76cbb5c',
  scripts: 'https://functions.poehali.dev/67bee5ed-2e16-4c21-828c-ada4070967af',
  forum: 'https://functions.poehali.dev/48a90ea7-4b94-4534-93b7-0dcdb3145964',
  servers: 'https://functions.poehali.dev/19045bec-e4dc-4b16-9967-bc8222ceaa76',
  messages: 'https://functions.poehali.dev/8a7e65ac-4952-4d02-9c01-cfab43acec43',
};

function getSession() {
  return localStorage.getItem('session_id') || '';
}

async function req(base: string, path: string, method = 'GET', body?: object, params?: Record<string, string>) {
  // Pass action via __path query param since proxy strips subpath
  const url = new URL(base);
  url.searchParams.set('__path', path);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Session-Id': getSession(),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

// AUTH
export const authApi = {
  register: (data: { username: string; email: string; password: string }) =>
    req(URLS.auth, '/register', 'POST', data),
  login: (data: { login: string; password: string }) =>
    req(URLS.auth, '/login', 'POST', data),
  logout: () => req(URLS.auth, '/logout', 'POST'),
  me: () => req(URLS.auth, '/me'),
  updateProfile: (data: { bio?: string; avatar_url?: string }) =>
    req(URLS.auth, '/profile', 'PUT', data),
};

// SCRIPTS
export const scriptsApi = {
  list: (params?: Record<string, string>) => req(URLS.scripts, '/list', 'GET', undefined, params),
  detail: (id: string) => req(URLS.scripts, '/detail', 'GET', undefined, { id }),
  download: (id: string) => req(URLS.scripts, '/download', 'POST', undefined, { id }),
  rate: (script_id: number, rating: number) => req(URLS.scripts, '/rate', 'POST', { script_id, rating }),
  create: (data: object) => req(URLS.scripts, '/create', 'POST', data),
};

// FORUM
export const forumApi = {
  categories: () => req(URLS.forum, '/categories'),
  topics: (params?: Record<string, string>) => req(URLS.forum, '/topics', 'GET', undefined, params),
  topic: (id: string) => req(URLS.forum, '/topic', 'GET', undefined, { id }),
  createTopic: (data: { title: string; body: string; category_id: number }) =>
    req(URLS.forum, '/topics', 'POST', data),
  reply: (data: { topic_id: number; body: string }) =>
    req(URLS.forum, '/replies', 'POST', data),
};

// SERVERS
export const serversApi = {
  list: (params?: Record<string, string>) => req(URLS.servers, '/list', 'GET', undefined, params),
  add: (data: object) => req(URLS.servers, '/add', 'POST', data),
  vote: (id: string) => req(URLS.servers, '/vote', 'POST', undefined, { id }),
  boost: (data: { server_id: number; days: number }) => req(URLS.servers, '/boost', 'POST', data),
};

// MESSAGES
export const messagesApi = {
  inbox: () => req(URLS.messages, '/inbox'),
  sent: () => req(URLS.messages, '/sent'),
  send: (data: { to: string; subject?: string; body: string }) =>
    req(URLS.messages, '/send', 'POST', data),
  read: (id: string) => req(URLS.messages, '/read', 'POST', undefined, { id }),
  notifications: () => req(URLS.messages, '/notifications'),
  readAllNotifications: () => req(URLS.messages, '/notifications/read', 'POST'),
};