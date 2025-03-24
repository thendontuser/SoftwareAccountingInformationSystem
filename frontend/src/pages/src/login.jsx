import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css'; 
import axios from 'axios';

const LoginPage = () => {
    const [surname, setSurname] = useState('');
    const [name, setName] = useState('');
    const [middlename, setMiddlename] = useState('');
    const [rolename, setRolename] = useState('');
    const [email, setEmail] = useState('');
    const [department, setDepartment] = useState('');
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            const data = {
                "surname" : 'none',
                "name" : 'none',
                "middlename" : 'none',
                "role_name" : 'none',
                "email" : 'none',
                "department_number": 1,
                "login" : login,
                "password_hash" : password
            }
            axios.post('http://127.0.0.1:8000/login/', data).then(response => {
                if (response.data === false) {
                    setErrorMessage('Неверный логин или пароль');
                } else {
                    setErrorMessage('');
                    setSurname(response.data['surname']);
                    setName(response.data['name']);
                    setMiddlename(response.data['middlename']);
                    setRolename(response.data['role_name']);
                    setEmail(response.data['email']);
                    setDepartment(response.data['department_number']);
                    console.log({'surname' : surname, 'name' : name, 'middlename' : middlename, 'role' : rolename, 'email' : email, 'department' : department, 'login' : login});
                }
            });
        } catch(error) {
            console.log(error.response.data);
        }
    };

    const handleRegistrationClick = (e) => {
        navigate('/reg');
    };

    return (
        <div className="login-container">
            <h2> Вход в систему </h2>
            {errorMessage && <p style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</p>}
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