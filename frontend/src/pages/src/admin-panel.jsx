import React, { useState, useEffect } from 'react';
import '../styles/admin-panel.css';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('software');
  const [editMode, setEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [userData, setUserData] = useState([]);

  // получение данных пользователя
  useEffect(() => {
    const storedUserData = localStorage.getItem("user_info");
    if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
    }
  }, []);
  
  // Примерные данные (в реальном приложении будут загружаться с сервера)
  const [software, setSoftware] = useState([
    { id: 1, name: 'Microsoft Office', version: '2019', license: 'Pro', begin_license: '2023-01-01', end_license: '2024-01-01', id_device: 1, id_developer: 1, logo_path: '/logos/office.png' },
    { id: 2, name: 'Adobe Photoshop', version: 'CC 2023', license: 'Creative Cloud', begin_license: '2023-02-15', end_license: '2024-02-15', id_device: 2, id_developer: 2, logo_path: '/logos/photoshop.png' }
  ]);
  
  const [developers, setDevelopers] = useState([
    { id: 1, name: 'Microsoft', type_of_company: 'Корпорация', location: 'США' },
    { id: 2, name: 'Adobe', type_of_company: 'Корпорация', location: 'США' }
  ]);
  
  const [devices, setDevices] = useState([
    { id: 1, name: 'PC-001', os_name: 'Windows 10', ip_address: '192.168.1.10', ram_value: 16, number_of_department: 1 },
    { id: 2, name: 'PC-002', os_name: 'Windows 11', ip_address: '192.168.1.11', ram_value: 32, number_of_department: 2 }
  ]);
  
  const [departments, setDepartments] = useState([
    { number: 1, name: 'IT отдел' },
    { number: 2, name: 'Бухгалтерия' }
  ]);
  
  const [users, setUsers] = useState([
    { id: 1, surname: 'Иванов', name: 'Иван', middlename: 'Иванович', role_name: 'admin', email: 'admin@company.com', department_number: 1, login: 'admin' },
    { id: 2, surname: 'Петров', name: 'Петр', middlename: 'Петрович', role_name: 'user', email: 'user@company.com', department_number: 2, login: 'user' }
  ]);
  
  const [requests, setRequests] = useState([
    { id: 1, id_software: 1, id_user: 2, status: 'pending' },
    { id: 2, id_software: 2, id_user: 2, status: 'approved' }
  ]);

  const handleEdit = (item) => {
    setEditMode(true);
    setCurrentItem(item);
  };

  const handleDelete = (id, collection) => {
    if (window.confirm('Вы уверены, что хотите удалить эту запись?')) {
      // В реальном приложении здесь будет запрос к API
      switch(collection) {
        case 'software':
          setSoftware(software.filter(item => item.id !== id));
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
    switch(activeTab) {
      case 'software':
        return (
          <div className="table-container">
            <button className="add-button" onClick={handleAdd}>Добавить ПО</button>
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
                {software.map(item => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.version}</td>
                    <td>{item.license}</td>
                    <td>{item.begin_license}</td>
                    <td>{item.end_license}</td>
                    <td>{item.id_device}</td>
                    <td>{item.id_developer}</td>
                    <td><img src={item.logo_path} alt="Логотип" className="logo-preview" /></td>
                    <td>
                      <button onClick={() => handleEdit(item)}>Редактировать</button>
                      <button onClick={() => handleDelete(item.id, 'software')}>Удалить</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'developers':
        return (
          <div className="table-container">
            <button className="add-button" onClick={handleAdd}>Добавить разработчика</button>
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
                {developers.map(item => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.type_of_company}</td>
                    <td>{item.location}</td>
                    <td>
                      <button onClick={() => handleEdit(item)}>Редактировать</button>
                      <button onClick={() => handleDelete(item.id, 'developers')}>Удалить</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'devices':
        return (
          <div className="table-container">
            <button className="add-button" onClick={handleAdd}>Добавить устройство</button>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Название</th>
                  <th>ОС</th>
                  <th>IP-адрес</th>
                  <th>ОЗУ (ГБ)</th>
                  <th>Номер отдела</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {devices.map(item => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.os_name}</td>
                    <td>{item.ip_address}</td>
                    <td>{item.ram_value}</td>
                    <td>{item.number_of_department}</td>
                    <td>
                      <button onClick={() => handleEdit(item)}>Редактировать</button>
                      <button onClick={() => handleDelete(item.id, 'devices')}>Удалить</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'departments':
        return (
          <div className="table-container">
            <button className="add-button" onClick={handleAdd}>Добавить отдел</button>
            <table>
              <thead>
                <tr>
                  <th>Номер</th>
                  <th>Название</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {departments.map(item => (
                  <tr key={item.number}>
                    <td>{item.number}</td>
                    <td>{item.name}</td>
                    <td>
                      <button onClick={() => handleEdit(item)}>Редактировать</button>
                      <button onClick={() => handleDelete(item.number, 'departments')}>Удалить</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'users':
        return (
          <div className="table-container">
            <button className="add-button" onClick={handleAdd}>Добавить пользователя</button>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Фамилия</th>
                  <th>Имя</th>
                  <th>Отчество</th>
                  <th>Роль</th>
                  <th>Email</th>
                  <th>Номер отдела</th>
                  <th>Логин</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {users.map(item => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.surname}</td>
                    <td>{item.name}</td>
                    <td>{item.middlename}</td>
                    <td>{item.role_name}</td>
                    <td>{item.email}</td>
                    <td>{item.department_number}</td>
                    <td>{item.login}</td>
                    <td>
                      <button onClick={() => handleEdit(item)}>Редактировать</button>
                      <button onClick={() => handleDelete(item.id, 'users')}>Удалить</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'requests':
        return (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>ID ПО</th>
                  <th>ID пользователя</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(item => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.id_software}</td>
                    <td>{item.id_user}</td>
                    <td>{item.status}</td>
                    <td>
                      <button onClick={() => handleEdit(item)}>Редактировать</button>
                      <button onClick={() => handleDelete(item.id, 'requests')}>Удалить</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
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
                <label>ID устройства:</label>
                <input type="number" name="id_device" value={currentItem.id_device || ''} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>ID разработчика:</label>
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
    </div>
  );
};

export default AdminPanel;