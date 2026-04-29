'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../components/Button/Button';
import Input from '../components/Input/Input';
import Select from '../components/Select/Select';
import Card from '../components/Card/Card';
import { isAuthenticated, removeToken } from '../lib/auth';
import { todoService } from '../services/todoService';
import { IconCheck, IconCircle, IconPencil, IconTrash, IconSave, IconX } from './Icons';
import styles from './TodoPage.module.css';

const FILTERS = ['Всі', 'Активні', 'Виконані'];
const PRIORITY_FILTERS = ['Всі', 'Low', 'Medium', 'High'];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const PRIORITY_LABELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

const formatDate = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleString('uk-UA', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export default function TodoPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [descriptionValue, setDescriptionValue] = useState('');
  const [priorityValue, setPriorityValue] = useState('low');
  const [filter, setFilter] = useState('Всі');
  const [priorityFilter, setPriorityFilter] = useState('Всі');
  const [error, setError] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  
  // States for editing
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // 1. Auth Guard + Початкове завантаження даних
  useEffect(() => {
    const authenticated = isAuthenticated();
    if (!authenticated) {
      router.push('/login');
      return;
    }
    setLoggedIn(true);
    setAuthChecked(true);
    
    // Завантажуємо задачі після успішної перевірки авторизації
    fetchTasks();
  }, [router]);

  const fetchTasks = async () => {
    setIsLoadingTasks(true);
    try {
      console.log('📥 Отримання задач з бекенду...');
      const data = await todoService.getAll();
      setTasks(data || []);
      console.log('✅ Задачі завантажено:', data);
    } catch (err) {
      console.warn('⚠️ Не вдалося завантажити задачі з бекенду (можливо, він вимкнений).');
      // Залишаємо порожній список або додаємо дефолтні для тесту
      setTasks([]);
    } finally {
      setIsLoadingTasks(false);
    }
  };

  if (!authChecked) return null;

  const handleLogout = () => {
    removeToken();
    setLoggedIn(false);
    router.push('/login');
  };

  // 2. Функція відправки даних (Backend Ready)
  const addTask = async () => {
    if (!inputValue.trim()) {
      setError('Введіть назву задачі');
      return;
    }

    const newTaskData = {
      text: inputValue.trim(),
      description: descriptionValue.trim(),
      priority: priorityValue,
      createdAt: new Date().toISOString(),
    };

    setIsSubmitting(true);
    setError('');

    try {
      console.log('📤 Відправка на бекенд:', newTaskData);
      
      // Справжній виклик сервісу
      const savedTask = await todoService.create(newTaskData);
      
      console.log('✅ Отримано від бекенду:', savedTask);
      setTasks([...tasks, { ...savedTask, done: false }]);
      
    } catch (err) {
      console.warn('⚠️ Бекенд не підключений (це нормально для фронта). Додаємо локально.');
      console.error('Деталі помилки:', err.message);
      
      // Локальне додавання для тестів фронтенду
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          ...newTaskData,
          done: false,
        },
      ]);
    } finally {
      setIsSubmitting(false);
      setInputValue('');
      setDescriptionValue('');
      setPriorityValue('low');
    }
  };

  const toggleTask = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    const newDoneState = !task.done;
    
    try {
      console.log(`🔄 Оновлення статусу задачі ${id} на бекенді...`);
      await todoService.update(id, { done: newDoneState });
    } catch (err) {
      console.warn('⚠️ Бекенд не відповів, оновлюємо статус локально.');
    } finally {
      setTasks(tasks.map((t) => (t.id === id ? { ...t, done: newDoneState } : t)));
    }
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditValue(task.text);
    setEditDescription(task.description || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
    setEditDescription('');
  };

  const saveEdit = async (id) => {
    if (!editValue.trim()) return;

    const updates = {
      text: editValue.trim(),
      description: editDescription.trim(),
    };

    try {
      console.log(`📝 Збереження змін для задачі ${id} на бекенді...`, updates);
      await todoService.update(id, updates);
    } catch (err) {
      console.warn('⚠️ Бекенд не відповів, зберігаємо зміни локально.');
    } finally {
      setTasks(tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)));
      cancelEdit();
    }
  };

  const deleteTask = async (id) => {
    try {
      console.log(`🗑️ Видалення задачі ${id} на бекенді...`);
      await todoService.delete(id);
    } catch (err) {
      console.warn('⚠️ Бекенд не відповів, видаляємо локально.');
    } finally {
      setTasks(tasks.filter((t) => t.id !== id));
    }
  };

  const clearDone = () => {
    setTasks(tasks.filter((t) => !t.done));
  };

  const filtered = tasks.filter((t) => {
    // Фільтр за статусом
    const matchesStatus = 
      filter === 'Всі' ? true :
      filter === 'Активні' ? !t.done :
      filter === 'Виконані' ? t.done : true;

    // Фільтр за пріоритетом
    const matchesPriority = 
      priorityFilter === 'Всі' ? true : 
      t.priority?.toLowerCase() === priorityFilter.toLowerCase();

    return matchesStatus && matchesPriority;
  });

  const doneCount = tasks.filter((t) => t.done).length;
  const totalCount = tasks.length;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>
            <span className={styles.logoText}>ToDo List</span>
          </div>
          <Button variant="secondary" size="medium" onClick={handleLogout}>
            Вийти
          </Button>
        </div>
      </header>

      <div className={styles.content}>
        {/* Stats */}
        <section className={styles.statsRow}>
          <Card title={String(totalCount)} description="Всього задач" />
          <Card title={String(totalCount - doneCount)} description="Активних" />
          <Card title={String(doneCount)} description="Виконано" />
        </section>

        {/* Form Container */}
        <section className={styles.todoBlock}>
          <h2 className={styles.blockTitle}>Додати нову задачу</h2>
          
          <div className={styles.addForm}>
            <div className={styles.addRow}>
              <Input
                label="Назва"
                placeholder="Що потрібно зробити?"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  if (error) setError('');
                }}
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
                error={error}
              />
              <Select
                label="Терміновість"
                options={PRIORITY_OPTIONS}
                value={priorityValue}
                onChange={(e) => setPriorityValue(e.target.value)}
              />
            </div>
            <div className={styles.addRow}>
              <Input
                label="Опис"
                placeholder="Додаткові деталі..."
                value={descriptionValue}
                onChange={(e) => setDescriptionValue(e.target.value)}
              />
              <Button 
                onClick={addTask} 
                size="medium" 
                disabled={isSubmitting}
                className={styles.addBtn}
              >
                {isSubmitting ? 'Зберігаємо...' : '+ Додати'}
              </Button>
            </div>
          </div>

          {/* Filter tabs */}
          <div className={styles.filterSection}>
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Статус:</span>
              <div className={styles.filters}>
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
            </div>

            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Пріоритет:</span>
              <div className={styles.filters}>
                {PRIORITY_FILTERS.map((f) => (
                  <button
                    key={f}
                    className={`${styles.filterBtn} ${priorityFilter === f ? styles.filterActive : ''} ${styles['btn_' + f.toLowerCase()]}`}
                    onClick={() => setPriorityFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

            {/* Task list */}
          <ul className={styles.list}>
            {isLoadingTasks ? (
              <li className={styles.empty}>
                <div className={styles.loader}></div>
                <p>Завантаження задач...</p>
              </li>
            ) : filtered.length === 0 ? (
              <li className={styles.empty}>
                <p>Тут поки нічого немає</p>
              </li>
            ) : (
              filtered.map((task) => (
                <li key={task.id} className={`${styles.item} ${task.done ? styles.itemDone : ''} ${editingId === task.id ? styles.itemEditing : ''}`}>
                  <button 
                    className={`${styles.checkbox} ${task.done ? styles.checkboxDone : ''}`} 
                    onClick={() => toggleTask(task.id)} 
                    disabled={editingId === task.id}
                  >
                    {task.done ? <IconCheck size={18} /> : <IconCircle size={20} />}
                  </button>

                  <div className={styles.taskContent}>
                    {editingId === task.id ? (
                      <div className={styles.editFields}>
                        <input 
                          className={styles.editInput}
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          autoFocus
                        />
                        <textarea 
                          className={styles.editTextarea}
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          placeholder="Опис..."
                        />
                      </div>
                    ) : (
                      <>
                        <div className={styles.taskTopRow}>
                          <span className={styles.taskText}>{task.text}</span>
                          <div className={styles.taskMeta}>
                            <span className={styles.taskDate}>{formatDate(task.createdAt)}</span>
                            <span className={`${styles.priorityBadge} ${styles[`priority_${task.priority}`]}`}>
                              {PRIORITY_LABELS[task.priority]}
                            </span>
                          </div>
                        </div>
                        {task.description && <span className={styles.taskDescription}>{task.description}</span>}
                      </>
                    )}
                  </div>

                  <div className={styles.itemActions}>
                    {editingId === task.id ? (
                      <>
                        <button className={styles.actionBtn} onClick={() => saveEdit(task.id)} title="Зберегти"><IconSave /></button>
                        <button className={styles.actionBtn} onClick={cancelEdit} title="Скасувати"><IconX /></button>
                      </>
                    ) : (
                      <>
                        <button className={styles.actionBtn} onClick={() => startEdit(task)} title="Редагувати"><IconPencil /></button>
                        <button className={`${styles.actionBtn} ${styles.btnDelete}`} onClick={() => deleteTask(task.id)} title="Видалити"><IconTrash /></button>
                      </>
                    )}
                  </div>
                </li>
              ))
            )}
          </ul>

          {/* Footer */}
          {doneCount > 0 && (
            <div className={styles.listFooter}>
              <span className={styles.doneHint}>{doneCount} виконано</span>
              <Button variant="tertiary" size="small" onClick={clearDone}>Очистити виконані</Button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
