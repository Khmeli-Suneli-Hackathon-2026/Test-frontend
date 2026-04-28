'use client';

import { useState } from 'react';
import Button from '../components/Button/Button';
import Input from '../components/Input/Input';
import Card from '../components/Card/Card';
import styles from './TodoPage.module.css';

const FILTERS = ['Всі', 'Активні', 'Виконані'];

export default function TodoPage() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('Всі');
  const [error, setError] = useState('');

  const addTask = () => {
    if (!inputValue.trim()) {
      setError('Введіть назву задачі');
      return;
    }
    setTasks([
      ...tasks,
      { id: Date.now(), text: inputValue.trim(), done: false },
    ]);
    setInputValue('');
    setError('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const clearDone = () => {
    setTasks(tasks.filter((t) => !t.done));
  };

  const filtered = tasks.filter((t) => {
    if (filter === 'Активні') return !t.done;
    if (filter === 'Виконані') return t.done;
    return true;
  });

  const doneCount = tasks.filter((t) => t.done).length;
  const totalCount = tasks.length;

  return (
    <main className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>
            <span className={styles.logoText}>ToDo List</span>
          </div>
          <Button href="/login" variant="secondary" size="medium">
            Увійти
          </Button>
        </div>
      </header>

      <div className={styles.content}>
        {/* Stats */}
        <section className={styles.statsRow}>
          <Card
            title={String(totalCount)}
            description="Всього задач"
          />
          <Card
            title={String(totalCount - doneCount)}
            description="Активних"
          />
          <Card
            title={String(doneCount)}
            description="Виконано"
          />
        </section>

        {/* Main todo block */}
        <section className={styles.todoBlock}>
          <h2 className={styles.blockTitle}>Мої задачі</h2>

          {/* Add task */}
          <div className={styles.addRow}>
            <Input
              placeholder="Нова задача..."
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (error) setError('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              error={error}
              id="new-task-input"
            />
            <Button onClick={addTask} size="medium" id="add-task-btn">
              + Додати
            </Button>
          </div>

          {/* Filter tabs */}
          <div className={styles.filters} role="tablist">
            {FILTERS.map((f) => (
              <button
                key={f}
                role="tab"
                aria-selected={filter === f}
                className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Task list */}
          <ul className={styles.list}>
            {filtered.length === 0 && (
              <li className={styles.empty}>
                <p>Тут поки нічого немає</p>
              </li>
            )}
            {filtered.map((task) => (
              <li key={task.id} className={`${styles.item} ${task.done ? styles.itemDone : ''}`}>
                <button
                  className={styles.checkbox}
                  onClick={() => toggleTask(task.id)}
                  aria-label={task.done ? 'Позначити як активне' : 'Позначити як виконане'}
                >
                  {task.done ? '✔️' : '⬜'}
                </button>
                <span className={styles.taskText}>{task.text}</span>
                <button
                  className={styles.deleteBtn}
                  onClick={() => deleteTask(task.id)}
                  aria-label="Видалити задачу"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>

          {/* Footer */}
          {doneCount > 0 && (
            <div className={styles.listFooter}>
              <span className={styles.doneHint}>{doneCount} виконано</span>
              <Button variant="tertiary" size="small" onClick={clearDone}>
                Очистити виконані
              </Button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
