const STD_ID = "12442099";
const API_KEY = "nYs43u5f1oGK9";
const API_BASE = "http://portal.almasar101.com/assignment/api";

const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const list = document.querySelector("#task-list");
const statusDiv = document.querySelector("#status");

function setStatus(msg, isError) {
  statusDiv.textContent = msg || "";
  statusDiv.style.color = isError ? "#d9363e" : "#666";
}

function buildUrl(file, extra) {
  let url =
    API_BASE +
    "/" +
    file +
    "?stdid=" +
    encodeURIComponent(STD_ID) +
    "&key=" +
    encodeURIComponent(API_KEY);

  if (extra) url += "&" + extra;
  return url;
}

function addTaskToList(task) {
  const li = document.createElement("li");
  li.className = "task-item";
  li.dataset.id = task.id;

  const span = document.createElement("span");
  span.className = "task-title";
  span.textContent = task.title;

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "task-delete";
  btn.textContent = "Delete";
  btn.onclick = function () {
    deleteTask(task.id, li);
  };

  li.appendChild(span);
  li.appendChild(btn);
  list.appendChild(li);
}

async function loadTasks() {
  try {
    setStatus("Loading tasks...");
    list.innerHTML = "";

    const res = await fetch(buildUrl("get.php"));
    const data = await res.json();

    if (!data.success) {
      throw new Error(data.message || "Error loading tasks");
    }

    if (data.tasks.length === 0) {
      setStatus("No tasks yet.");
      return;
    }

    for (let i = 0; i < data.tasks.length; i++) {
      addTaskToList(data.tasks[i]);
    }

    setStatus("Tasks loaded.");
  } catch (err) {
    console.log(err);
    setStatus(err.message, true);
  }
}

async function addTask(title) {
  const res = await fetch(buildUrl("add.php"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: title }),
  });

  const data = await res.json();

  if (!data.success) {
    throw new Error(data.message || "Error adding task");
  }

  if (data.task) {
    addTaskToList(data.task);
  } else {
    loadTasks();
  }
}

async function deleteTask(id, li) {
  if (!confirm("Delete this task?")) return;

  try {
    setStatus("Deleting task...");

    const res = await fetch(buildUrl("delete.php", "id=" + id));
    const data = await res.json();

    if (!data.success) {
      throw new Error(data.message || "Error deleting task");
    }

    li.remove();
    setStatus("Task deleted.");
  } catch (err) {
    console.log(err);
    setStatus(err.message, true);
  }
}

document.addEventListener("DOMContentLoaded", loadTasks);

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const title = input.value.trim();
  if (title === "") return;

  try {
    setStatus("Adding task...");
    await addTask(title);
    input.value = "";
    setStatus("Task added.");
  } catch (err) {
    console.log(err);
    setStatus(err.message, true);
  }
});
