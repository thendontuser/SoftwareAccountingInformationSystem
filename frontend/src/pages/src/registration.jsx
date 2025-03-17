import React, { useState } from 'react';
import '../styles/login.css'; 

const RegPage = () => {
    const [lastname, setLastname] = useState('');
    const [name, setName] = useState('');
    const [middlename, setMiddlename] = useState('');
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login:', login);
        console.log('Password:', password);
    };

    return (
        <div className="login-container">
            <h2> Регистрация </h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="lastname"> Фамилия </label>
                        <input
                            type="text"
                            id="lastname"
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)}
                            required
                    />
                    <label htmlFor="name"> Имя </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                    />
                    <label htmlFor="middlename"> Отчество </label>
                        <input
                            type="text"
                            id="middlename"
                            value={lastname}
                            onChange={(e) => setMiddlename(e.target.value)}
                            required
                    />
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
                <button type="submit"> Регистрация </button>
            </form>
        </div>
    );
};

export default RegPage;