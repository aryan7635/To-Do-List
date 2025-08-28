document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.getElementById("addTaskBtn");
  const taskInput = document.getElementById("taskInput");
  const daysInput = document.getElementById("daysInput");
  const taskList = document.getElementById("taskList");

  function getRemainingDays(deadline) {
    const now = new Date();
    const diff = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? `${diff} day(s) left` : "Expired";
  }

  function createTaskElement(taskText, days) {
    const li = document.createElement("li");
    li.classList.add("adding");
    setTimeout(() => li.classList.remove("adding"), 10);

    const span = document.createElement("span");
    span.textContent = taskText;
    span.addEventListener("click", () => {
      li.classList.toggle("completed");
    });

    // Deadline calculation
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + Number(days));

    // Remaining time element
    const timeSpan = document.createElement("span");
    timeSpan.className = "task-time";
    timeSpan.textContent = getRemainingDays(deadline);

    // Update remaining time every day
    const interval = setInterval(() => {
      timeSpan.textContent = getRemainingDays(deadline);
      if (getRemainingDays(deadline) === "Expired") clearInterval(interval);
    }, 60 * 60 * 1000); // update every hour

    // Edit button
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "edit-btn";
    editBtn.addEventListener("click", () => {
      const input = document.createElement("input");
      input.type = "text";
      input.value = span.textContent;
      input.className = "edit-input";
      li.replaceChild(input, span);
      input.focus();

      input.addEventListener("blur", () => {
        span.textContent = input.value.trim() || span.textContent;
        li.replaceChild(span, input);
      });

      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          input.blur();
        }
      });
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";
    deleteBtn.addEventListener("click", () => {
      li.classList.add("removing");
      setTimeout(() => {
        taskList.removeChild(li);
      }, 400);
    });

    li.appendChild(span);
    li.appendChild(timeSpan);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    return li;
  }

  function updateCounter() {
    const tasks = document.querySelectorAll("#taskList li:not(.completed)");
    document.getElementById("taskCounter").textContent = `Tasks left: ${tasks.length}`;
  }

  addBtn.addEventListener("click", () => {
    const taskText = taskInput.value.trim();
    const days = daysInput.value.trim();
    if (taskText !== "" && days !== "" && Number(days) > 0) {
      const task = createTaskElement(taskText, days);
      taskList.appendChild(task);
      taskInput.value = "";
      daysInput.value = "";
      updateCounter();
    }
  });

  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addBtn.click();
    }
  });

  daysInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addBtn.click();
    }
  });

  taskList.addEventListener("click", (e) => {
    if (e.target.tagName === "SPAN" || e.target.classList.contains("delete-btn")) {
      setTimeout(updateCounter, 410);
    }
  });

  updateCounter();
});