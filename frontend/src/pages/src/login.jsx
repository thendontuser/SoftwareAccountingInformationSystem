import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css'; 

const LoginPage = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login:', login);
        console.log('Password:', password);
    };

    const handleRegistrationClick = (e) => {
        navigate('/reg');
    };

    return (
        <div className="login-container">
            <h2> Вход в систему </h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="login"> Логин </label>
                    <input
                        type="login"
                        id="login"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password"> Пароль </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit"> Войти </button>
                <button onClick={handleRegistrationClick}> Зарегистрироваться </button>
            </form>
        </div>
    );
};

export default LoginPage;