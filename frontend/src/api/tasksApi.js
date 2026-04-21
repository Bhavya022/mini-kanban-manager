const BASE = (import.meta.env.VITE_API_URL || 'https://mini-kanban-manager.onrender.com') + '/tasks';

async function handleResponse(res) {
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Something went wrong');
  return json.data ?? json;
}

export const tasksApi = {
  getAll: () =>
    fetch(BASE).then(handleResponse),

  create: (title) =>
    fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    }).then(handleResponse),

  updateStatus: (id, status) =>
    fetch(`${BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).then(handleResponse),

  remove: (id) =>
    fetch(`${BASE}/${id}`, { method: 'DELETE' }).then(handleResponse),
};
