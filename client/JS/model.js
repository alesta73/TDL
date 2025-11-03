// const KEY = "mainList";
const API_URL = "http://localhost:3000";

export const model = {
    //lists: 
    async getLists() {
        const res = await fetch(`${API_URL}/lists`);
        if (!res.ok) throw new Error("Failed to fetch lists");
        return await res.json();
    },

    async addList(name) {
        const res = await fetch(`${API_URL}/lists`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
        });
        if (!res.ok) throw new Error("Failed to add list");
        return await res.json();
    },
    async deleteList(id) {
        const res = await fetch(`${API_URL}/lists/${id}`, {
            method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete list");
        return await res.json();
    },

    
  // 2. ---- TaskLists (you’ll extend this soon) ----
  // placeholder until we build /tasklists endpoints
  async getTaskLists(listId) {
    const res = await fetch(`${API_URL}/lists/${listId}/tasklists`);
    if (!res.ok) throw new Error("Failed to fetch tasklists");
    return await res.json();
  },

  async addTaskList(listId, name, date) {
    const res = await fetch(`${API_URL}/lists/${listId}/tasklists`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, date }),
    });
    if (!res.ok) throw new Error("Failed to add tasklist");
    return await res.json();
  },

  async deleteTaskList(id) {
    const res = await fetch(`${API_URL}/tasklists/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete tasklist");
    return await res.json();
  },

    async getTasks(tasklistId) {
    const res = await fetch(`${API_URL}/tasks/${tasklistId}`);
    if (!res.ok) throw new Error("Failed to fetch tasks");
    return await res.json();
  },

  async addTask(tasklistId, name) {
    const res = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tasklist_id: tasklistId, name }),
    });
    if (!res.ok) throw new Error("Failed to add task");
    return await res.json();
  },

  async deleteTask(id) {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete task");
    return await res.json();
  },


}