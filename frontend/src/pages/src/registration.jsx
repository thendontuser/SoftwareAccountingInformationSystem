import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/login.css'; 

const RegPage = () => {
    const [lastname, setLastname] = useState('');
    const [name, setName] = useState('');
    const [middlename, setMiddlename] = useState('');
    const [role, setRole] = useState('user');
    const [email, setEmail] = useState('');

    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');

    const [login, setLogin] = useState('');
    const [loginError, setLoginError] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            const data = {
                "surname": lastname,
                "name": name,
                "middlename": middlename,
                "role_name": role,
                "department_number": selectedDepartment,
                "email": email,
                "login": login,
                "password_hash": password
            }
            axios.post('http://127.0.0.1:8000/reg/', data).then(response => {
                if (response.data === 'userIsExists') {
                    setLoginError('Логин занят');
                } else {
                    setLoginError('');
                    axios.post('http://127.0.0.1:8000/departments/', {"number" : selectedDepartment, 'name' : 'none'}).then(response_department => {
                        localStorage.setItem("user_info", JSON.stringify({
                            'id' : response.id,
                            'surname' : lastname,
                            'name' : name,
                            'middlename' : middlename,
                            'email' : email,
                            'department' : response_department.data
                        }));
                        if (role === 'user') {
                            navigate('/userPage');
                        } else {
                            // navigate('adminPage/');
                        }
                    });
                }
            });
        } catch(error) {
            console.error('Ошибка при регистрации:', error.response.data);
        }
    };

    useEffect(() => {
        const getDepartments = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/departments/');
                setDepartments(response.data);
                setSelectedDepartment(response.data[0].number);
            } catch (error) {
                console.error('Ошибка при получении отделов:', error);
            }
        }; 

        getDepartments();
    }, [])

    const handleDepartmentChange = (event) => {
        setSelectedDepartment(event.target.value);
    };

    return (
        <div className="login-container">
            <h2> Регистрация </h2>
            {loginError && <p style={{ color: 'red', textAlign: 'center' }}>{loginError}</p>}
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

                    <label htmlFor="department"> Отдел </label>
                        <select 
                            id="department" 
                            value={selectedDepartment}
                            onChange={(e) => handleDepartmentChange(e)}
                            required>
                                {departments.map(department => (
                                    <option value={department['number']}> {department['name']} </option>))}
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

                    <label htmlFor="email"> Email </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    
                    <label htmlFor="login"> Логин </label>
                    <input
                        type="login"
                        id="login"
                        value={login}
                        onChange={(e) => {setLogin(e.target.value); setLoginError('')}}
                        placeholder={loginError.valueOf()}
                        required
                        style={{ borderColor: loginError ? 'red' : '', color: loginError ? 'red' : '' }}
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