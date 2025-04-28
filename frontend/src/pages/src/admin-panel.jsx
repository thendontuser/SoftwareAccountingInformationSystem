import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/admin-panel.css';

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('software');
    const [editMode, setEditMode] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [userData, setUserData] = useState([]);

    const [softwares, setSoftwares] = useState([]);
    const [devices, setDevices] = useState([]);
    const [developers, setDevelopers] = useState([]);
    const [users, setUsers] = useState([]);
    const [requests, setRequests] = useState([]);
    const [departments, setDepartments] = useState([]);

    // получение данных пользователя
    useEffect(() => {
      const storedUserData = localStorage.getItem("user_info");
      if (storedUserData) {
          setUserData(JSON.parse(storedUserData));
      }
    }, []);

    // получение списка ПО
    useEffect(() => {
      const getSoftwares = async () => {
          try {
              const response = await axios.get('http://127.0.0.1:8000/software/', {params: {'is_all' : true}});
              setSoftwares(response.data);
          } catch (error) {
              alert("Ошибка при получении данных о ПО" + error);
          }
      }; 
      getSoftwares();
    }, []);

    // получение списка компьютеров
    useEffect(() => {
        const getDevices = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/devices/');
                setDevices(response.data);
            } catch (error) {
              alert("Ошибка при получении данных об устройствах" + error);
            }
        }; 
        getDevices();
    }, []);

    // получение списка разработчиков
    useEffect(() => {
      const getDevelopers = async () => {
          try {
              const response = await axios.get('http://127.0.0.1:8000/developers/');
              setDevelopers(response.data);
          } catch (error) {
            alert("Ошибка при получении данных о разработчиках" + error);
          }
      }; 
      getDevelopers();
    }, []);

    // получение списка пользователей
    useEffect(() => {
      const getUsers = async () => {
          try {
              const response = await axios.get('http://127.0.0.1:8000/users/');
              setUsers(response.data);
          } catch (error) {
            alert("Ошибка при получении данных о пользователях" + error);
          }
      }; 
      getUsers();
    }, []);

    // получение списка заявок
    useEffect(() => {
      const getRequests = async () => {
          try {
              const response = await axios.get('http://127.0.0.1:8000/request/', {params: {is_all_users : true, id_user: 0}});
              setRequests(response.data);
          } catch (error) {
            alert("Ошибка при получении данных о заявках" + error);
          }
      }; 
      getRequests();
    }, []);

    // получение списка отделов
    useEffect(() => {
      const getDepartments = async () => {
          try {
              const response = await axios.get('http://127.0.0.1:8000/departments/');
              setDepartments(response.data);
          } catch (error) {
            alert("Ошибка при получении данных об отделах" + error);
          }
      }; 
      getDepartments();
  }, [])

    const handleEdit = (item) => {
      setEditMode(true);
      setCurrentItem(item);
    };

    const handleDelete = (id, collection) => {
      if (window.confirm('Вы уверены, что хотите удалить эту запись?')) {
        // В реальном приложении здесь будет запрос к API
        switch(collection) {
          case 'software':
            setSoftwares(softwares.filter(item => item.id !== id));
            break;
          case 'developers':
            setDevelopers(developers.filter(item => item.id !== id));
            break;
          case 'devices':
            setDevices(devices.filter(item => item.id !== id));
            break;
          case 'departments':
            setDepartments(departments.filter(item => item.number !== id));
            break;
          case 'users':
            setUsers(users.filter(item => item.id !== id));
            break;
          case 'requests':
            setRequests(requests.filter(item => item.id !== id));
            break;
          default:
            break;
        }
      }
    };

    const handleSave = (e) => {
      e.preventDefault();
      // В реальном приложении здесь будет запрос к API
      setEditMode(false);
      setCurrentItem(null);
    };

    const handleAdd = () => {
      setEditMode(true);
      setCurrentItem({});
    };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setCurrentItem(prev => ({ ...prev, [name]: value }));
    };

    const renderTable = () => {
      const getTitle = () => {
        switch(activeTab) {
          case 'software': return 'Программное обеспечение';
          case 'developers': return 'Разработчики';
          case 'devices': return 'Устройства';
          case 'departments': return 'Отделы';
          case 'users': return 'Пользователи';
          case 'requests': return 'Заявки';
          default: return '';
        }
      };

      const renderTableContent = () => {
        switch(activeTab) {
          case 'software':
            return (
              <div className="table-container">
                <button className="add-button" onClick={handleAdd}>Добавить ПО</button>
                <div className="table-scroll-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Название</th>
                        <th>Версия</th>
                        <th>Лицензия</th>
                        <th>Начало лицензии</th>
                        <th>Конец лицензии</th>
                        <th>Устройство</th>
                        <th>Разработчик</th>
                        <th>Логотип</th>
                        <th>Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {softwares?.map(item => (
                        <tr key={item.id}>
                          <td>{item.id}</td>
                          <td>{item.name}</td>
                          <td>{item.version}</td>
                          <td>{item.license}</td>
                          <td>{item.license_begin}</td>
                          <td>{item.license_end}</td>
                          <td>{item.device?.name}</td>
                          <td>{item.developer?.name}</td>
                          <td><img src={item.logo_path} alt="Логотип" className="logo-preview" /></td>
                          <td className="action-buttons">
                            <button onClick={() => handleEdit(item)}>Редактировать</button>
                            <button onClick={() => handleDelete(item.id, 'software')}>Удалить</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          case 'developers':
            return (
              <div className="table-container">
                <button className="add-button" onClick={handleAdd}>Добавить разработчика</button>
                <div className="table-scroll-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Название</th>
                        <th>Тип компании</th>
                        <th>Местоположение</th>
                        <th>Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {developers?.map(item => (
                        <tr key={item.id}>
                          <td>{item.id}</td>
                          <td>{item.name}</td>
                          <td>{item.type_of_company}</td>
                          <td>{item.location}</td>
                          <td className="action-buttons">
                            <button onClick={() => handleEdit(item)}>Редактировать</button>
                            <button onClick={() => handleDelete(item.id, 'developers')}>Удалить</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          case 'devices':
            return (
              <div className="table-container">
                <button className="add-button" onClick={handleAdd}>Добавить устройство</button>
                <div className="table-scroll-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Название</th>
                        <th>ОС</th>
                        <th>IP-адрес</th>
                        <th>ОЗУ (ГБ)</th>
                        <th>Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {devices?.map(item => (
                        <tr key={item.id}>
                          <td>{item.number}</td>
                          <td>{item.name}</td>
                          <td>{item.os_name}</td>
                          <td>{item.ip_address}</td>
                          <td>{item.ram_value}</td>
                          <td className="action-buttons">
                            <button onClick={() => handleEdit(item)}>Редактировать</button>
                            <button onClick={() => handleDelete(item.id, 'devices')}>Удалить</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          case 'departments':
            return (
              <div className="table-container">
                <button className="add-button" onClick={handleAdd}>Добавить отдел</button>
                <div className="table-scroll-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Номер</th>
                        <th>Название</th>
                        <th>Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departments?.map(item => (
                        <tr key={item.number}>
                          <td>{item.number}</td>
                          <td>{item.name}</td>
                          <td className="action-buttons">
                            <button onClick={() => handleEdit(item)}>Редактировать</button>
                            <button onClick={() => handleDelete(item.id, 'departments')}>Удалить</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          case 'users':
            return (
              <div className="table-container">
                <div className="table-scroll-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Фамилия</th>
                        <th>Имя</th>
                        <th>Отчество</th>
                        <th>Роль</th>
                        <th>Email</th>
                        <th>Отдел</th>
                        <th>Логин</th>
                        <th>Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users?.map(item => (
                        <tr key={item.id}>
                          <td>{item.id}</td>
                          <td>{item.surname}</td>
                          <td>{item.name}</td>
                          <td>{item.middlename}</td>
                          <td>{item.role_name}</td>
                          <td>{item.email}</td>
                          <td>{item.department}</td>
                          <td>{item.login}</td>
                          <td className="action-buttons">
                            <button onClick={() => handleEdit(item)}>Редактировать</button>
                            <button onClick={() => handleDelete(item.id, 'users')}>Удалить</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          case 'requests':
            return (
              <div className="table-container">
                <div className="table-scroll-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Номер</th>
                        <th>ПО</th>
                        <th>Пользователь</th>
                        <th>Статус</th>
                        <th>Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests?.map(item => (
                        <tr key={item.id}>
                          <td>{item.number}</td>
                          <td>{item.software}</td>
                          <td>{item.user}</td>
                          <td>{item.status}</td>
                          <td className="action-buttons">
                            <button onClick={() => handleEdit(item)}>Редактировать</button>
                            <button onClick={() => handleDelete(item.id, 'requests')}>Удалить</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          default:
            return null;
        }};

        return (
          <div className="table-container">
            <h2 className="table-title">{getTitle()}</h2>
            {renderTableContent()}
          </div>
        );
    };

    const renderEditForm = () => {
      if (!editMode) return null;

      const getFormFields = () => {
        switch(activeTab) {
          case 'software':
            return (
              <>
                <div className="form-group">
                  <label>Название:</label>
                  <input type="text" name="name" value={currentItem.name || ''} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Версия:</label>
                  <input type="text" name="version" value={currentItem.version || ''} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Лицензия:</label>
                  <input type="text" name="license" value={currentItem.license || ''} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Начало лицензии:</label>
                  <input type="date" name="begin_license" value={currentItem.begin_license || ''} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Конец лицензии:</label>
                  <input type="date" name="end_license" value={currentItem.end_license || ''} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Устройство:</label>
                  <select 
                    id="device"
                    value={''}
                    onChange={(e) => handleInputChange(e.target.value)}
                    required>
                        {devices.map(device => (
                        <option value={device['number']}> {device['name']} </option>))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Разработчик:</label>
                  <input type="number" name="id_developer" value={currentItem.id_developer || ''} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Путь к логотипу:</label>
                  <input type="text" name="logo_path" value={currentItem.logo_path || ''} onChange={handleInputChange} />
                </div>
              </>
            );
          case 'developers':
            return (
              <>
                <div className="form-group">
                  <label>Название:</label>
                  <input type="text" name="name" value={currentItem.name || ''} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Тип компании:</label>
                  <input type="text" name="type_of_company" value={currentItem.type_of_company || ''} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Местоположение:</label>
                  <input type="text" name="location" value={currentItem.location || ''} onChange={handleInputChange} />
                </div>
              </>
            );
          case 'devices':
            return (
              <>
                <div className="form-group">
                  <label>Название:</label>
                  <input type="text" name="name" value={currentItem.name || ''} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>ОС:</label>
                  <input type="text" name="os_name" value={currentItem.os_name || ''} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>IP-адрес:</label>
                  <input type="text" name="ip_address" value={currentItem.ip_address || ''} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>ОЗУ (ГБ):</label>
                  <input type="number" name="ram_value" value={currentItem.ram_value || ''} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Номер отдела:</label>
                  <input type="number" name="number_of_department" value={currentItem.number_of_department || ''} onChange={handleInputChange} />
                </div>
              </>
            );
          case 'departments':
            return (
              <>
                <div className="form-group">
                  <label>Номер:</label>
                  <input type="number" name="number" value={currentItem.number || ''} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Название:</label>
                  <input type="text" name="name" value={currentItem.name || ''} onChange={handleInputChange} />
                </div>
              </>
            );
          case 'users':
            return (
              <>
                <div className="form-group">
                  <label>Фамилия:</label>
                  <input type="text" name="surname" value={currentItem.surname || ''} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Имя:</label>
                  <input type="text" name="name" value={currentItem.name || ''} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Отчество:</label>
                  <input type="text" name="middlename" value={currentItem.middlename || ''} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Роль:</label>
                  <input type="text" name="role_name" value={currentItem.role_name || ''} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <input type="email" name="email" value={currentItem.email || ''} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Номер отдела:</label>
                  <input type="number" name="department_number" value={currentItem.department_number || ''} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Логин:</label>
                  <input type="text" name="login" value={currentItem.login || ''} onChange={handleInputChange} />
                </div>
              </>
            );
          case 'requests':
            return (
              <>
                <div className="form-group">
                  <label>ID ПО:</label>
                  <input type="number" name="id_software" value={currentItem.id_software || ''} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>ID пользователя:</label>
                  <input type="number" name="id_user" value={currentItem.id_user || ''} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Статус:</label>
                  <select name="status" value={currentItem.status || ''} onChange={handleInputChange}>
                    <option value="pending">Ожидает</option>
                    <option value="approved">Одобрено</option>
                    <option value="rejected">Отклонено</option>
                  </select>
                </div>
              </>
            );
          default:
            return null;
        }
      };

      return (
        <div className="edit-form-overlay">
          <div className="edit-form">
            <h3>{currentItem.id ? 'Редактирование' : 'Добавление'}</h3>
            <form onSubmit={handleSave}>
              {getFormFields()}
              <div className="form-actions">
                <button type="submit">Сохранить</button>
                <button type="button" onClick={() => setEditMode(false)}>Отмена</button>
              </div>
            </form>
          </div>
        </div>
      );
    };

    return (
      <div className="admin-panel">
        <header className="admin-header">
          <h1>Учет программного обеспечения</h1>
          <div className="admin-info">
            <span className="admin-name">{userData?.surname} {userData?.name} {userData?.middlename}</span>
            <button className="logout-button">Выйти</button>
          </div>
        </header>
        
        <nav className="admin-nav">
          <ul>
            <li className={activeTab === 'software' ? 'active' : ''} onClick={() => setActiveTab('software')}>Программное обеспечение</li>
            <li className={activeTab === 'developers' ? 'active' : ''} onClick={() => setActiveTab('developers')}>Разработчики</li>
            <li className={activeTab === 'devices' ? 'active' : ''} onClick={() => setActiveTab('devices')}>Устройства</li>
            <li className={activeTab === 'departments' ? 'active' : ''} onClick={() => setActiveTab('departments')}>Отделы</li>
            <li className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>Пользователи</li>
            <li className={activeTab === 'requests' ? 'active' : ''} onClick={() => setActiveTab('requests')}>Заявки</li>
          </ul>
        </nav>
        
        <main className="admin-content">
          {renderTable()}
        </main>
        
        {renderEditForm()}

        <footer className='dashboard-footer'>
          <p>&copy; {new Date().getFullYear()} Учет программного обеспечения. Все права защищены.</p>
        </footer>
      </div>
    );
};

export default AdminPanel;