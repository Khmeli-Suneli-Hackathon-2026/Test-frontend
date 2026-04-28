import Input from './Input/Input';
import Button from './Button/Button';
import styles from './page.module.css';

export default function RegisterPage() {
    return (
        <main className={styles.page}>
            <div className={styles.card}>
                <h2>Створити акаунт</h2>
                <p>Заповніть форму нижче</p>

                <form className={styles.form}>
                    <Input label="Ім'я" placeholder="..." />
                    <Input label="Email" type="email" placeholder="..." />
                    <Input label="Пароль" type="password" hint="Мінімум 8 символів" />
                    <Input label="Підтвердити пароль" type="password" />
                    <Button type="submit">Зареєструватись</Button>
                </form>
            </div>
        </main>
    );
}
