import React, { useLayoutEffect, useState } from 'react';
import axios from 'axios';
import '../styles/login.css'; 

const RegPage = () => {
    const [lastname, setLastname] = useState('');
    const [name, setName] = useState('');
    const [middlename, setMiddlename] = useState('');
    const [role, setRole] = useState('');
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            const data = {
                "surname": lastname,
                "name": name,
                "middlename": middlename,
                "role_name": role,
                "login": login,
                "password_hash": password
            }
            axios.post('http://127.0.0.1:8000/reg/', data).then(response => {
                console.log('Success:', response.data);
            });
        } catch(error) {
            console.error('Ошибка при регистрации:', error.response.data);
        }
    };

    return (
        <div className="login-container">
            <h2> Регистрация </h2>
            <form onSubmit={handleSubmit}>
                <div className="select-group">
                    <label htmlFor="rolename"> Роль </label>
                        <select 
                            id="role" 
                            defaultValue="user"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required>
                                <option value="user">Обычный пользователь</option>
                                <option value="admin">Администратор</option>
                        </select>
                </div>

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
                        value={middlename}
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