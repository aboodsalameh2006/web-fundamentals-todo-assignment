// File: js/app.js
// Student: abdelraheem salameh abunaser (12442099)

// Configuration for this student (do not change STUDENT_ID value)
const STUDENT_ID = "12442099";
const API_KEY = "nYs43u5f1oGK9";
const API_BASE = "https://portal.almasar101.com/assignment/api";

// Grab elements from the DOM
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const statusDiv = document.getElementById("status");
const list = document.getElementById("task-list");

function setStatus(message, isError = false) {
    if (!statusDiv) return;
    statusDiv.textContent = message || "";
    statusDiv.style.color = isError ? "#d9363e" : "#666666";
}

/* =========================
   TODO 1: Load tasks
========================= */
document.addEventListener("DOMContentLoaded", function () {
    setStatus("Loading tasks...");

    fetch(
        API_BASE +
        "/get.php?stdid=" +
        STUDENT_ID +
        "&key=" +
        API_KEY
    )
        .then((res) => res.json())
        .then((data) => {
            if (data.tasks) {
                data.tasks.forEach((task) => {
                    renderTask(task);
                });
            }
            setStatus("");
        })
        .catch(() => {
            setStatus("Error loading tasks", true);
        });
});

/* =========================
   TODO 2: Add task
========================= */
if (form) {
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const title = input.value.trim();
        if (title === "") return;

        setStatus("Adding task...");

        fetch(
            API_BASE +
            "/add.php?stdid=" +
            STUDENT_ID +
            "&key=" +
            API_KEY,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title: title }),
            }
        )
            .then((res) => res.json())
            .then((data) => {
                if (data.task) {
                    renderTask(data.task);
                    input.value = "";
                    setStatus("Task added");
                }
            })
            .catch(() => {
                setStatus("Error adding task", true);
            });
    });
}

/* =========================
   TODO 3: Render + Delete
========================= */
function renderTask(task) {
    const li = document.createElement("li");
    li.className = "task-item";

    const span = document.createElement("span");
    span.className = "task-title";
    span.textContent = task.title;

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const delBtn = document.createElement("button");
    delBtn.className = "task-delete";
    delBtn.textContent = "Delete";

    delBtn.addEventListener("click", function () {
        if (!confirm("Delete this task?")) return;

        fetch(
            API_BASE +
            "/delete.php?stdid=" +
            STUDENT_ID +
            "&key=" +
            API_KEY +
            "&id=" +
            task.id
        )
            .then((res) => res.json())
            .then(() => {
                li.remove();
                setStatus("Task deleted");
            })
            .catch(() => {
                setStatus("Error deleting task", true);
            });
    });

    actions.appendChild(delBtn);
    li.appendChild(span);
    li.appendChild(actions);
    list.appendChild(li);
}
