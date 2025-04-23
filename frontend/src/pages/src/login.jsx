import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css'; 
import axios from 'axios';

const LoginPage = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    let userData = {};

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            const data = {
                "surname" : 'none',
                "name" : 'none',
                "middlename" : 'none',
                "role_name" : 'none',
                "email" : 'none',
                "department_number" : 1,
                "login" : login,
                "password_hash" : password
            }
            axios.post('http://127.0.0.1:8000/login/', data).then(response => {
                if (response.data === false) {
                    setErrorMessage('Неверный логин или пароль');
                } else {
                    setErrorMessage('');

                    const dep_data = {
                        "number" : response.data["department_number"],
                        "name" : 'none'
                    }                    
                    axios.post('http://127.0.0.1:8000/departments/', dep_data).then(response_department => {
                        if (response_department.data === 'None') {
                            console.log('Ошибка в поиске отдела');
                            return;
                        } else {
                            userData = {
                                'id' : response.data['id'],
                                'surname' : response.data['surname'],
                                'name' : response.data['name'],
                                'middlename' : response.data['middlename'],
                                'email' : response.data['email'],
                                'department' : response_department.data
                            };

                            localStorage.setItem("user_info", JSON.stringify(userData));

                            if (response.data['role_name'] === 'user') {
                                navigate('userPage/');
                            } else {
                                navigate('adminPage/');
                            }
                        }
                    });
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
            <form>
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
                <button type="submit" onClick={handleSubmit}> Войти </button>
                <button onClick={handleRegistrationClick}> Зарегистрироваться </button>
            </form>
        </div>
    );
};

export default LoginPage;