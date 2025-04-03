import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/user-panel.css';

const UserPage = () => {
    const [softwareId, setSoftwareId] = useState(0);
    const [softwareName, setSoftwareName] = useState('');
    const [softwareVersion, setSoftwareVersion] = useState('');
    const [softwareLicense, setSoftwareLicense] = useState('');
    const [softwareLicenseBegin, setSoftwareLicenseBegin] = useState(new Date);
    const [softwareLicenseEnd, setSoftwareLicenseEnd] = useState(new Date);
    const [deviceNumber, setDeviceNumber] = useState('');
    const [developerId, setDeveloperId] = useState(0);
    const [deviceName, setDeviceName] = useState('');
    const [developerName, setDeveloperName] = useState('');

    const [softwares, setSoftwares] = useState([]);
    const [devices, setDevices] = useState([]);

    const [userData, setUserData] = useState(null);

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
                const response = await axios.get('http://127.0.0.1:8000/devices');
                setDevices(response.data);
            } catch (error) {
                console.error('Ошибка при получении списка ПО:', error);
            }
        }; 

        getDevices();
    }, []);

    const handleSoftwareChange = (value) => {
        softwares.forEach(software => {
            if (software.id === value) {
                setSoftwareName(software.name);
                setSoftwareVersion(software.version);
                setSoftwareLicense(software.license);
                setSoftwareLicenseBegin(software.license_begin);
                setSoftwareLicenseEnd(software.license_end);
                setDeveloperId(software.id_developer);
                
                try {
                    const response = axios.get('http://127.0.0.1:8000/developers/');
                    response.data.forEach(developer => {
                        if (developer.id === developerId) {
                            setDeveloperName(developer.name);
                        }
                    });
                } catch (error) {
                    console.error('Ошибка при получении списка разработчиков:', error);
                }
            }
        });
    };

    const handleDeviceChange = (value) => {
        setDeviceName(value);
    };

    const [softwareDetails, setSoftwareDetails] = useState({
        name: softwareName,
        version: '',
        license: '',
        startDate: '',
        endDate: '',
        computerNumber: deviceNumber,
        developer: developerId,
        logoPath: ''
    });
    const [report, setReport] = useState(null);

    const handleSubmitRequest = (e) => {
        e.preventDefault();
        console.log('Заявка на установку ПО:', softwareDetails);
        setSoftwareDetails({
            name: softwareName,
            version: '',
            license: '',
            startDate: '',
            endDate: '',
            computerNumber: deviceNumber,
            developer: developerId,
            logoPath: ''
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
                        <form onSubmit={handleSubmitRequest}>
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
                                    <option value={device['id']}> {device['name']} </option>))}
                            </select>

                            <input
                                type="text"
                                name="version"
                                value={softwareLicense}
                                placeholder="Версия"
                                readOnly
                                required
                            />
                            <input
                                type="text"
                                name="license"
                                value={softwareLicense}
                                placeholder="Лицензия"
                                readOnly
                                required
                            />
                            <input
                                type="date"
                                name="startDate"
                                value={softwareLicenseBegin}
                                placeholder="Дата начала лицензии"
                                readOnly
                                required
                            />
                            <input
                                type="date"
                                name="endDate"
                                value={softwareLicenseEnd}
                                placeholder="Дата окончания лицензии"
                                readOnly
                                required
                            />
                            <input
                                type="text"
                                name="developer"
                                value={developerName}
                                placeholder="Разработчик"
                                readOnly
                            />
                            <input
                                type="text"
                                name="logoPath"
                                value='logo'
                                placeholder="Логотип"
                            />
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
                            <textarea readOnly>
                                
                            </textarea>
                        </section>
                    </div>
                </div>
            </main>
            <footer className='dashboard-footer'>
                <p>&copy; {new Date().getFullYear()} Учет программного обеспечения Все права защищены.</p>
            </footer>
        </div>
    );
};

export default UserPage;