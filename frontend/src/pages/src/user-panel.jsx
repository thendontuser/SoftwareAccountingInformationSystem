import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/user-panel.css';
import { data } from 'react-router-dom';

const UserPage = () => {
    const [softwareName, setSoftwareName] = useState('');
    const [softwareVersion, setSoftwareVersion] = useState('');
    const [softwareLicense, setSoftwareLicense] = useState('Пробная');
    const [softwareLicenseBegin, setSoftwareLicenseBegin] = useState(new Date);
    const [softwareLicenseEnd, setSoftwareLicenseEnd] = useState(new Date);
    const [softwareLogoPath, setSoftwareLogoPath] = useState('');

    const [deviceNumber, setDeviceNumber] = useState(0);
    const [deviceName, setDeviceName] = useState('');

    const [developerId, setDeveloperId] = useState(0);
    const [developerName, setDeveloperName] = useState('');

    const [softwares, setSoftwares] = useState([]);
    const [devices, setDevices] = useState([]);
    const [requests, setRequests] = useState('');

    const [userData, setUserData] = useState([]);

    window.csrfToken = '{{ csrf_token }}';

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
                const response = await axios.get('http://127.0.0.1:8000/software/');
                setSoftwares(response.data);

                setSoftwareName(response.data[0].name);
                setSoftwareLogoPath(response.data[0].logo_path);
                setDeveloperId(response.data[0].developer.id);
                setDeveloperName(response.data[0].developer.name);
            } catch (error) {
                console.error('Ошибка при получении списка ПО:', error);
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
                setDeviceName(response.data[0].name);
                setDeviceNumber(response.data[0].number);
            } catch (error) {
                console.error('Ошибка при получении списка утсройств:', error);
            }
        }; 
        getDevices();
    }, []);

    // получение списка заявок
    useEffect(() => {
        const getRequests = async () => {
            if (userData?.id) {
                try {
                    const response = await axios.get('http://127.0.0.1:8000/request/', {params: {is_all_users : false, id_user : userData.id}});
                    setRequests(response.data);
                } catch (error) {
                    setRequests('Ошибка при получении списка Заявок:');
                }
            }
        };
        getRequests();
    }, [userData]);

    const handleSoftwareChange = (value) => {
        softwares.forEach(software => {
            if (software.name === value) {
                setSoftwareName(software.name);
                setSoftwareVersion(software.version);
                setSoftwareLicense(software.license);
                setSoftwareLogoPath(software.logo_path);
                setDeveloperId(software.developer.id);
                setDeveloperName(software.developer.name);
            }
        });
    };

    const handleDeviceChange = (value) => {
        setDeviceName(value);

        devices.forEach(device => {
            if (device.name === value) {
                setDeviceNumber(device.number);
            }
        });
    };

    const [report, setReport] = useState(null);

    const handleSubmitRequest = (e) => {
        e.preventDefault();
        const data = {
            software : {
                'name' : softwareName,
                'version' : softwareVersion,
                'license' : softwareLicense,
                'license_begin' : softwareLicenseBegin.toString(),
                'license_end' : softwareLicenseEnd.toString(),
                'id_device' : deviceNumber,
                'id_developer' : developerId,
                'logo_path' : softwareLogoPath
            },
            user : {
                'id' : userData.id,
                'email' : userData.email
            }
        };
        axios.post('http://127.0.0.1:8000/check_request/', data).then(req_response => {
            if (req_response.data['state'] === true) {
                axios.post('http://127.0.0.1:8000/software/', data['software'], {headers: {'Content-Type': 'application/json',}}).then(soft_response => {
                    axios.post('http://127.0.0.1:8000/request/', {'id_software' : soft_response.data['id'], 'id_user' : userData.id}).then(response => {
                        alert('Ваша заявка будет рассмотрена, и уведомление придет на почту ' + userData.email);
                    })
                })
            }
        });
    };

    const handleGetReport = () => {
        
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Учет ПО(Отдел {userData?.department})</h1>
                <div className='dashboard-header-user'>
                    <h3 className='user-name'>{userData?.surname} {userData?.name} {userData?.middlename}</h3>
                    <h4 className='email'>{userData?.email}</h4>
                </div>
            </header>
            <main className="dashboard-main">
                <div className="horizontal-blocks">
                    <section className="request-section block">
                        <h2>Заявка на установку ПО</h2>
                        <form onSubmit={handleSubmitRequest} method='post'>
                            <select 
                                id="software" 
                                value={softwareName}
                                onChange={(e) => handleSoftwareChange(e.target.value)}
                                required>
                                    {softwares.map(software => (
                                    <option value={software['id']}> {software['name']} </option>))}
                            </select>
                            <select 
                                id="device"
                                value={deviceName}
                                onChange={(e) => handleDeviceChange(e.target.value)}
                                required>
                                    {devices.map(device => (
                                    <option value={device['name']}> {device['name']} </option>))}
                            </select>
                            <select 
                                id="license" 
                                value={softwareLicense}
                                onChange={(e) => setSoftwareLicense(e.target.value)}
                                required>
                                    <option value={'Пробная'}> {'Пробная'} </option>
                                    <option value={'Бесплатная'}> {'Бесплатная'} </option>
                                    <option value={'Коммерческая'}> {'Коммерческая'} </option>
                            </select>

                            <input
                                type="text"
                                name="version"
                                value={softwareVersion}
                                onChange={(e) => setSoftwareVersion(e.target.value)}
                                placeholder="Версия"
                                required
                            />
                            <input
                                type="date"
                                name="startDate"
                                value={softwareLicenseBegin}
                                onChange={(e) => setSoftwareLicenseBegin(e.target.value)}
                                placeholder="Дата начала лицензии"
                                required
                            />
                            <input
                                type="date"
                                name="endDate"
                                value={softwareLicenseEnd}
                                onChange={(e) => setSoftwareLicenseEnd(e.target.value)}
                                placeholder="Дата окончания лицензии"
                                required
                            />
                            <input
                                type="text"
                                name="developer"
                                value={'Разработчик: ' + developerName}
                                placeholder="Разработчик"
                                readOnly
                            />
                            <img src={softwareLogoPath} width="100" height="100"></img>
                            <br />
                            <button type="submit" className="submit-button">Отправить заявку</button>
                        </form>
                    </section>

                    <div className="vertical-blocks">
                        <section className="report-section block">
                            <h2>Перечень ПО({userData?.department})</h2>
                            <button onClick={handleGetReport} className="report-button">Получить отчет</button>
                            {report && (
                                <div className="report-output">
                                    <h3>Отчет:</h3>
                                    <p>{report}</p>
                                </div>
                            )}
                        </section>

                        <section className='my-requests block'>
                            <h2>Ваши заявки</h2>
                            <textarea readOnly value={requests}></textarea>
                        </section>
                    </div>
                </div>
            </main>
            <footer className='dashboard-footer'>
                <p>&copy; {new Date().getFullYear()} Учет программного обеспечения. Все права защищены.</p>
            </footer>
        </div>
    );
};

export default UserPage;