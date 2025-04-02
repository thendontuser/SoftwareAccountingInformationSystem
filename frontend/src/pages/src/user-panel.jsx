import React, { useState, useEffect } from 'react';
import '../styles/user-panel.css';

const UserPage = () => {
    const [softwareName, setSoftwareName] = useState('');
    const [deviceNumber, setDeviceNumber] = useState('');
    const [developer, setDeveloper] = useState('');

    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const storedUserData = localStorage.getItem("user_info");
        if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
        }
    }, []);

    const [softwareDetails, setSoftwareDetails] = useState({
        name: softwareName,
        version: '',
        license: '',
        startDate: '',
        endDate: '',
        computerNumber: deviceNumber,
        developer: developer,
        logoPath: ''
    });
    const [report, setReport] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSoftwareDetails({
            ...softwareDetails,
            [name]: value
        });
    };

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
            developer: developer,
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
                                onChange={(e) => setSoftwareName(e.target.value)}
                                required>
                                    <option value="1">Visual Studio 2022 Comunity</option>
                                    <option value="2">Sublime Text 3</option>
                            </select>
                            <select 
                                id="device"
                                value={deviceNumber}
                                onChange={(e) => setDeviceNumber(e.target.value)}
                                required>
                                    <option value="1">ASUS 3000</option>
                                    <option value="2">HP 7500</option>
                            </select>

                            <input
                                type="text"
                                name="version"
                                value={softwareDetails.version}
                                onChange={handleInputChange}
                                placeholder="Версия"
                                required
                            />
                            <input
                                type="text"
                                name="license"
                                value={softwareDetails.license}
                                onChange={handleInputChange}
                                placeholder="Лицензия"
                                required
                            />
                            <input
                                type="date"
                                name="startDate"
                                value={softwareDetails.startDate}
                                onChange={handleInputChange}
                                placeholder="Дата начала лицензии"
                                required
                            />
                            <input
                                type="date"
                                name="endDate"
                                value={softwareDetails.endDate}
                                onChange={handleInputChange}
                                placeholder="Дата окончания лицензии"
                                required
                            />
                            <input
                                type="text"
                                name="developer"
                                value={softwareDetails.developer}
                                onChange={handleInputChange}
                                placeholder="Разработчик"
                                readOnly
                            />
                            <input
                                type="text"
                                name="logoPath"
                                value={softwareDetails.logoPath}
                                onChange={handleInputChange}
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
        </div>
    );
};

export default UserPage;