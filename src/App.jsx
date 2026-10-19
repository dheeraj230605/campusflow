
import { useEffect, useState } from "react";
import "./App.css";

const initialTasks = [
  {
    id: 1,
    title: "Complete DBMS assignment",
    subject: "DBMS",
    dueDate: "2026-10-22",
    priority: "High",
    completed: false,
  },
  {
    id: 2,
    title: "Revise DSA sorting algorithms",
    subject: "DSA",
    dueDate: "2026-10-23",
    priority: "Medium",
    completed: false,
  },
  {
    id: 3,
    title: "Prepare OS lab record",
    subject: "Operating Systems",
    dueDate: "2026-10-25",
    priority: "Low",
    completed: true,
  },
];

function App() {
 const [tasks, setTasks] = useState(() => {
  try {
    const savedTasks = localStorage.getItem("campusflow-tasks");
    return savedTasks ? JSON.parse(savedTasks) : initialTasks;
  } catch {
    return initialTasks;
  }
});

useEffect(() => {
  localStorage.setItem("campusflow-tasks", JSON.stringify(tasks));
}, [tasks]);
  const [filter, setFilter] = useState("All");
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");

  const completed = tasks.filter((task) => task.completed).length;
  const pending = tasks.length - completed;

  const visibleTasks = tasks.filter((task) => {
    if (filter === "Pending") return !task.completed;
    if (filter === "Completed") return task.completed;
    return true;
  });

  function addTask(event) {
    event.preventDefault();

    if (!title.trim() || !subject.trim() || !dueDate) return;

    setTasks((current) => [
      ...current,
      {
        id: Date.now(),
        title: title.trim(),
        subject: subject.trim(),
        dueDate,
        priority,
        completed: false,
      },
    ]);

    setTitle("");
    setSubject("");
    setDueDate("");
    setPriority("Medium");
  }

  function toggleTask(id) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  function deleteTask(id) {
    setTasks((current) => current.filter((task) => task.id !== id));
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <a className="brand" href="#dashboard">
          <span className="brand-icon">C</span>
          CampusFlow
        </a>

        <p className="nav-label">WORKSPACE</p>
        <a className="nav-link active" href="#dashboard">▦ Dashboard</a>
        <a className="nav-link" href="#assignments">☷ My Assignments</a>
        <a className="nav-link" href="#add-task">＋ Add Assignment</a>

        <div className="sidebar-note">
          <span>✦</span>
          <h3>Small steps, big results.</h3>
          <p>Stay consistent. Your goals are closer than you think.</p>
        </div>

        <p className="sidebar-footer">CampusFlow · Student Edition</p>
      </aside>

      <main className="main" id="dashboard">
        <header className="topbar">
          <div>
            <p className="eyebrow">YOUR PERSONAL WORKSPACE</p>
            <h1>Student Dashboard</h1>
          </div>
          <div className="avatar">S</div>
        </header>

        <section className="welcome">
          <div>
            <p className="eyebrow light">YOUR DAY, ORGANIZED</p>
            <h2>Make today count.</h2>
            <p>Organize assignments and stay ahead of your deadlines.</p>
          </div>
          <span className="welcome-symbol">✦</span>
        </section>

        <section className="stats">
          <article className="stat">
            <span>Total assignments</span>
            <strong>{tasks.length}</strong>
            <small>All your tasks</small>
          </article>
          <article className="stat">
            <span>Pending</span>
            <strong>{pending}</strong>
            <small>Still to complete</small>
          </article>
          <article className="stat">
            <span>Completed</span>
            <strong>{completed}</strong>
            <small>Tasks finished</small>
          </article>
          <article className="stat">
            <span>Completion rate</span>
            <strong>
              {tasks.length
                ? Math.round((completed / tasks.length) * 100)
                : 0}%
            </strong>
            <small>Overall progress</small>
          </article>
        </section>

        <section className="content">
          <div className="panel" id="assignments">
            <div className="panel-heading">
              <div>
                <h2>Your assignments</h2>
                <p>Keep your academic work on track.</p>
              </div>
              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                aria-label="Filter assignments"
              >
                <option>All</option>
                <option>Pending</option>
                <option>Completed</option>
              </select>
            </div>

            <div className="task-list">
              {visibleTasks.map((task) => (
                <article className="task" key={task.id}>
                  <button
                    className={`check ${task.completed ? "checked" : ""}`}
                    onClick={() => toggleTask(task.id)}
                    aria-label="Toggle task completion"
                  >
                    {task.completed ? "✓" : ""}
                  </button>

                  <div className="task-info">
                    <h3 className={task.completed ? "done" : ""}>
                      {task.title}
                    </h3>
                    <p>
                      {task.subject} · Due{" "}
                      {new Date(task.dueDate + "T12:00:00").toLocaleDateString(
                        "en-IN",
                        { day: "numeric", month: "short" }
                      )}
                    </p>
                  </div>

                  <span className={`priority ${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>

                  <button
                    className="delete"
                    onClick={() => deleteTask(task.id)}
                    aria-label={`Delete ${task.title}`}
                  >
                    ×
                  </button>
                </article>
              ))}

              {visibleTasks.length === 0 && (
                <p className="empty">No tasks found. Add an assignment!</p>
              )}
            </div>
          </div>

          <div className="panel form-panel" id="add-task">
            <h2>Quick add</h2>
            <p className="form-intro">Add your next assignment.</p>

            <form onSubmit={addTask}>
              <label htmlFor="title">Assignment title</label>
              <input
                id="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Finish DSA lab"
                required
              />

              <label htmlFor="subject">Subject</label>
              <input
                id="subject"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                placeholder="e.g. Computer Networks"
                required
              />

              <label htmlFor="due-date">Due date</label>
              <input
                id="due-date"
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                required
              />

              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                value={priority}
                onChange={(event) => setPriority(event.target.value)}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>

              <button className="primary-button" type="submit">
                + Add assignment
              </button>
            </form>
          </div>
        </section>

        <footer className="footer">
          CampusFlow · Built to make student life simpler.
        </footer>
      </main>
    </div>
  );
}

export default App;
