const KEY = "mainList";

export const model = {
    read() {
        const raw = localStorage.getItem(KEY);
        return raw ? JSON.parse(raw) : null;
    },

    save(obj) {
        localStorage.setItem(KEY, JSON.stringify(obj));
    },
    ensureBootstrapped() {
        if (!this.read()) {
            this.save({
                "Default List": { name: "Default List", taskLists: {} }
            });
        }
    },
    getLists() {
        return this.read() || {};
    },

    //???
    addList(listName) {
        const obj = this.getLists();
        if (!obj[listName]) obj[listName] = { name: listName, taskLists: {} }
        this.save(obj);
    },
    addTaskList(currentListName, taskListName, displayDate) {
        const obj = this.getLists();
        const cur = obj[currentListName];
        if (!cur) return false;

        cur.taskLists[taskListName] = {
            id: crypto.randomUUID(),
            name: taskListName,
            date: displayDate,
            tasks: {}
        };

        this.save(obj);
        return true;
    },
    //???
    addTask(currentListName, taskListName, taskName) {
        const obj = this.getLists();
        const cur = obj[currentListName];
        if (!cur?.taskLists[taskListName]) return false;
        cur.taskLists[taskListName].tasks[taskName] = { name: taskName };
        this.save(obj);
        return true;
    },
    deleteList(listName) {
        const obj = this.getLists();
        if (Object.keys(obj).length <= 1) return { ok: false, reason: "only-one-left" }
        delete obj[listName];
        this.save(obj);
        return { ok: true };
    },
    deleteTaskList(currentListName, taskListName, taskName) {
        const obj = this.getLists();
        delete obj[currentListName]?.taskLists?.tasks?.[taskName];
        this.save(obj);
    },
    deleteTask(currentListName, taskListName, taskName) {
        const obj = this.getLists();
        delete obj[currentListName]?.taskLists?.[taskListName]?.tasks?.[taskName];
        this.save(obj);
    }
}