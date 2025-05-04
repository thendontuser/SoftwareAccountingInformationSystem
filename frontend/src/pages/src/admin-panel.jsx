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

    const [selectedSoftwareDeviceId, setSelectedSoftwareDeviceId] = useState(0);
    const [selectedSoftwareDeviceName, setSelectedSoftwareDeviceName] = useState('');

    const [selectedSoftwareDeveloperId, setSelectedSoftwareDeveloperId] = useState(0);
    const [selectedSoftwareDeveloperName, setSelectedSoftwareDeveloperName] = useState('');

    const [selectedDepartmentNumber, setSelectedDepartmentNumber] = useState(0);
    const [selectedDepartmentName, setSelectedDepartmentName] = useState('');

    const [isEdit, setIsEdit] = useState(false);
    const [editCollection, setEditCollection] = useState('');

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
              const response = await axios.get('http://127.0.0.1:8000/departments/', {params : {'is_all' : true}});
              setDepartments(response.data);
          } catch (error) {
            alert("Ошибка при получении данных об отделах" + error);
          }
      }; 
      getDepartments();
    }, []);

    const handleEdit = (item, collection) => {
      setIsEdit(true);
      setEditCollection(collection);
      setEditMode(true);
      setCurrentItem(item);
    };

    const handleDelete = async (id, collection) => {
      if (window.confirm('Вы уверены, что хотите удалить эту запись?')) {
        switch(collection) {
          case 'software':
            try {
              await axios.delete(`http://127.0.0.1:8000/softwares/${id}/delete/`);
              const response = await axios.get('http://127.0.0.1:8000/software/', {params: {'is_all' : true}});
              setSoftwares(response.data);
            } catch (error) {
              console.error('Ошибка удаления:', error);
              alert('Не удалось удалить ПО');
            }
            break;
          case 'developers':
            try {
              await axios.delete(`http://127.0.0.1:8000/developers/${id}/delete/`);
              const response = await axios.get('http://127.0.0.1:8000/developers/');
              setDevelopers(response.data);
            } catch (error) {
              console.error('Ошибка удаления:', error);
              alert('Не удалось удалить разработчика');
            }
            break;
          case 'devices':
            try {
              await axios.delete(`http://127.0.0.1:8000/devices/${id}/delete/`);
              const response = await axios.get('http://127.0.0.1:8000/devices/');
              setDevices(response.data);
            } catch (error) {
              console.error('Ошибка удаления:', error);
              alert('Не удалось удалить устройство');
            }
            break;
          case 'departments':
            try {
              await axios.delete(`http://127.0.0.1:8000/departments/${id}/delete/`);
              const response = await axios.get('http://127.0.0.1:8000/departments/', {params: {'is_all' : true}});
              setDepartments(response.data);
            } catch (error) {
              console.error('Ошибка удаления:', error);
              alert('Не удалось удалить отдел');
            }
            break;
          case 'users':
            try {
              await axios.delete(`http://127.0.0.1:8000/users/${id}/delete/`);
              const response = await axios.get('http://127.0.0.1:8000/users/');
              setUsers(response.data);
            } catch (error) {
              console.error('Ошибка удаления:', error);
              alert('Не удалось удалить пользователя');
            }
            break;
          default:
            break;
        }
      }
    };

    const handleSave = async (e) => {
      e.preventDefault();

      if (isEdit) {
        switch (editCollection) {
          case 'softwares':
            if (!currentItem.license_begin || !currentItem.license_end) {
              alert('Укажите даты начала и окончания лицензии');
              return;
            }
            const licenseBegin = new Date(currentItem.license_begin).toISOString().split('T')[0];
            const licenseEnd = new Date(currentItem.license_end).toISOString().split('T')[0];
            try {
              await axios.put(`http://127.0.0.1:8000/softwares/${currentItem.id}/update/`, {
                'name' : currentItem.name,
                'version' : currentItem.version,
                'license' : currentItem.license,
                'license_begin' : licenseBegin,
                'license_end' : licenseEnd,
                'id_developer' : currentItem.developer.id,
                'id_device' : currentItem.device.id,
                'logo_path' : currentItem.logo_path
              });
              const response = await axios.get('http://127.0.0.1:8000/software/', {params: {'is_all' : true}});
              setSoftwares(response.data);
            }
            catch (error) {
              console.log(error);
              alert('Не удалось отредактировать ПО');
            }
            break;
          case 'developers':
            try {
              await axios.put(`http://127.0.0.1:8000/developers/${currentItem.id}/update/`, {
                'name' : currentItem.name,
                'type_of_company' : currentItem.type_of_company,
                'location' : currentItem.location
              });
              const response = await axios.get('http://127.0.0.1:8000/developers/');
              setDevelopers(response.data);
            }
            catch (error) {
              console.log(error);
              alert('Не удалось отредактировать разработчика');
            }
            break;
          case 'devices':
            try {
              await axios.put(`http://127.0.0.1:8000/devices/${currentItem.number}/update/`, {
                'name' : currentItem.name,
                'os_name' : currentItem.os_name,
                'ip_address' : currentItem.ip_address,
                'ram_value' : currentItem.ram_value,
                'number_of_department' : selectedDepartmentNumber
              });
              const response = await axios.get('http://127.0.0.1:8000/devices/');
              setDevices(response.data);
            }
            catch (error) {
              console.log(error);
              alert('Не удалось отредактировать устройтсво');
            }
            break;
          case 'departments':
            try {
              await axios.put(`http://127.0.0.1:8000/departments/${currentItem.number}/update/`, {
                'number' : currentItem.number,
                'name' : currentItem.name
              });
              const response = await axios.get('http://127.0.0.1:8000/departments/', {params: {'is_all' : true}});
              setDepartments(response.data);
            }
            catch (error) {
              console.log(error);
              alert('Не удалось отредактировать отдел');
            }
            break;
          case 'users':
            try {
              await axios.put(`http://127.0.0.1:8000/users/${currentItem.id}/update/`, {
                'surname' : currentItem.surname,
                'name' : currentItem.name,
                'middlename' : currentItem.middlename,
                'role_name' : currentItem.role_name,
                'email' : currentItem.email,
                'department_number' : selectedDepartmentNumber,
                'login' : currentItem.login
              });
              const response = await axios.get('http://127.0.0.1:8000/users/');
              setUsers(response.data);
            }
            catch (error) {
              console.log(error);
              alert('Не удалось отредактировать пользователя');
            }
            break;
          case 'requests':
            try {
              await axios.put(`http://127.0.0.1:8000/requests/${currentItem.number}/update/`, {
                'status' : currentItem.status
              });
              const response = await axios.get('http://127.0.0.1:8000/request/', {params : {'is_all_users' : true}});
              setRequests(response.data);
            }
            catch (error) {
              console.log(error);
              alert('Не удалось отредактировать заявку');
            }
            break;
          default:
            break;
        }
      } else {
        switch (editCollection) {
          case 'softwares':
            if (!currentItem.license_begin || !currentItem.license_end) {
              alert('Укажите даты начала и окончания лицензии');
              return;
            }
            const licenseBegin = new Date(currentItem.license_begin).toISOString().split('T')[0];
            const licenseEnd = new Date(currentItem.license_end).toISOString().split('T')[0];
            try {
              await axios.post('http://127.0.0.1:8000/software/', {
                'name' : currentItem.name,
                'version' : currentItem.version,
                'license' : currentItem.license,
                'license_begin' : licenseBegin,
                'license_end' : licenseEnd,
                'id_developer' : selectedSoftwareDeveloperId,
                'id_device' : selectedSoftwareDeviceId,
                'logo_path' : currentItem.logo_path
              });
              const response = await axios.get('http://127.0.0.1:8000/software/', {params: {'is_all' : true}});
              setSoftwares(response.data);
            }
            catch (error) {
              console.log(error);
              alert('Не удалось добавить ПО');
            }
            break;
          case 'developers':
            try {
              await axios.post('http://127.0.0.1:8000/developers/', {
                'name' : currentItem.name,
                'type_of_company' : currentItem.type_of_company,
                'location' : currentItem.location
              });
              const response = await axios.get('http://127.0.0.1:8000/developers/');
              setDevelopers(response.data);
            }
            catch (error) {
              console.log(error);
              alert('Не удалось добавить разработчика');
            }
            break;
          case 'devices':
            try {
              await axios.post('http://127.0.0.1:8000/devices/', {
                'name' : currentItem.name,
                'os_name' : currentItem.os_name,
                'ip_address' : currentItem.ip_address,
                'ram_value' : currentItem.ram_value,
                'number_of_department' : selectedDepartmentNumber
              });
              const response = await axios.get('http://127.0.0.1:8000/devices/');
              setDevices(response.data);
            }
            catch (error) {
              console.log(error);
              alert('Не удалось добавить устройтсво');
            }
            break;
          case 'departments':
            try {
              await axios.post('http://127.0.0.1:8000/departments/', {
                'number' : currentItem.number,
                'name' : currentItem.name
              });
              const response = await axios.get('http://127.0.0.1:8000/departments/', {params: {'is_all' : true}});
              setDepartments(response.data);
            }
            catch (error) {
              console.log(error);
              alert('Не удалось добавить отдел');
            }
            break;
          default:
            break;
        }
      }
      setEditMode(false);
      setCurrentItem(null);
    };

    const handleAdd = (collection) => {
      setIsEdit(false);
      setEditCollection(collection);
      setEditMode(true);
      setCurrentItem({});
    };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setCurrentItem(prev => ({ ...prev, [name]: value }));
    };

    const handleSoftwareDevice = (value) => {
      setSelectedSoftwareDeviceName(value);

      devices.forEach(device => {
        if (device.name === value) {
            setSelectedSoftwareDeviceId(device.number);
        }
      });
    };

    const handleSoftwareDeveloper = (value) => {
      setSelectedSoftwareDeveloperName(value);

      developers.forEach(developer => {
        if (developer.name === value) {
          setSelectedSoftwareDeveloperId(developer.id);
        }
      });
    };

    const handleDepartment = (value) => {
      setSelectedDepartmentName(value);

      departments.forEach(department => {
        if (department.name === value) {
          setSelectedDepartmentNumber(department.number);
        }
      });
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
                <button className="add-button" onClick={() => handleAdd('softwares')}>Добавить ПО</button>
                <div className="table-scroll-wrapper">
                  <table>
                    <thead>
                      <tr>
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
                          <td>{item.name}</td>
                          <td>{item.version}</td>
                          <td>{item.license}</td>
                          <td>{item.license_begin}</td>
                          <td>{item.license_end}</td>
                          <td>{item.device?.name}</td>
                          <td>{item.developer?.name}</td>
                          <td><img src={item.logo_path} alt="Логотип" className="logo-preview" /></td>
                          <td className="action-buttons">
                            <button onClick={() => handleEdit(item, 'softwares')}>Редактировать</button>
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
                <button className="add-button" onClick={() => handleAdd('developers')}>Добавить разработчика</button>
                <div className="table-scroll-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Название</th>
                        <th>Тип компании</th>
                        <th>Местоположение</th>
                        <th>Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {developers?.map(item => (
                        <tr key={item.id}>
                          <td>{item.name}</td>
                          <td>{item.type_of_company}</td>
                          <td>{item.location}</td>
                          <td className="action-buttons">
                            <button onClick={() => handleEdit(item, 'developers')}>Редактировать</button>
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
                <button className="add-button" onClick={() => handleAdd('devices')}>Добавить устройство</button>
                <div className="table-scroll-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Номер</th>
                        <th>Название</th>
                        <th>ОС</th>
                        <th>IP-адрес</th>
                        <th>ОЗУ (ГБ)</th>
                        <th>Отдел</th>
                        <th>Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {devices?.map(item => (
                        <tr key={item.number}>
                          <td>{item.number}</td>
                          <td>{item.name}</td>
                          <td>{item.os_name}</td>
                          <td>{item.ip_address}</td>
                          <td>{item.ram_value}</td>
                          <td>{item.department.name}</td>
                          <td className="action-buttons">
                            <button onClick={() => handleEdit(item, 'devices')}>Редактировать</button>
                            <button onClick={() => handleDelete(item.number, 'devices')}>Удалить</button>
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
                <button className="add-button" onClick={() => handleAdd('departments')}>Добавить отдел</button>
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
                            <button onClick={() => handleEdit(item, 'departments')}>Редактировать</button>
                            <button onClick={() => handleDelete(item.number, 'departments')}>Удалить</button>
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
                          <td>{item.surname}</td>
                          <td>{item.name}</td>
                          <td>{item.middlename}</td>
                          <td>{item.role_name}</td>
                          <td>{item.email}</td>
                          <td>{item.department.name}</td>
                          <td>{item.login}</td>
                          <td className="action-buttons">
                            <button onClick={() => handleEdit(item, 'users')}>Редактировать</button>
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
                        <tr key={item.number}>
                          <td>{item.number}</td>
                          <td>{item.software}</td>
                          <td>{item.user}</td>
                          <td>{item.status}</td>
                          <td className="action-buttons">
                            <button onClick={() => handleEdit(item, 'requests')}>Редактировать</button>
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
                  <input type="date" name="license_begin" value={currentItem.license_begin || ''} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Конец лицензии:</label>
                  <input type="date" name="license_end" value={currentItem.license_end || ''} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Устройство:</label>
                  <select 
                    id="device"
                    value={selectedSoftwareDeviceName}
                    onChange={(e) => {handleSoftwareDevice(e.target.value)}}
                    required>
                        {devices.map(device => (
                        <option value={device['name']}> {device['name']} </option>))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Разработчик:</label>
                  <select 
                    id="developer"
                    value={selectedSoftwareDeveloperName}
                    onChange={(e) => {handleSoftwareDeveloper(e.target.value)}}
                    required>
                        {developers.map(developer => (
                        <option value={developer['name']}> {developer['name']} </option>))}
                  </select>
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
                  <label>Отдел:</label>
                  <select 
                    id="department"
                    value={selectedDepartmentName}
                    onChange={(e) => {handleDepartment(e.target.value)}}
                    required>
                        {departments.map(department => (
                        <option value={department['name']}> {department['name']} </option>))}
                  </select>
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
                  <label>Отдел:</label>
                  <select 
                    id="department"
                    value={selectedDepartmentName}
                    onChange={(e) => handleDepartment(e.target.value)}
                    required>
                        {departments.map(department => (
                        <option value={department['name']}> {department['name']} </option>))}
                  </select>
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
                  <label>Статус:</label>
                  <select name="status" value={currentItem.status || ''} onChange={handleInputChange}>
                    <option value="Одобрено">Одобрено</option>
                    <option value="Отклонено">Отклонено</option>
                  </select>
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