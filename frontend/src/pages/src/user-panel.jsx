import React, { useState } from 'react';
import '../styles/user-panel.css';

const UserPage = ({ userName }) => {
    const [softwareDetails, setSoftwareDetails] = useState({
        name: '',
        version: '',
        license: '',
        startDate: '',
        endDate: '',
        computerNumber: '',
        developer: '',
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
            name: '',
            version: '',
            license: '',
            startDate: '',
            endDate: '',
            computerNumber: '',
            developer: '',
            logoPath: ''
        });
    };

    const handleGetReport = () => {
        const fetchedReport = "Отчет об установленном ПО: Программное обеспечение A, Программное обеспечение B"; 
        setReport(fetchedReport);
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Учет ПО(Отдел ФИТР)</h1>
                <span className="user-name">{"Корякин Андрей Александрович"}</span>
            </header>
            <main className="dashboard-main">
                <div className="horizontal-blocks">
                    <section className="request-section block">
                        <h2>Заявка на установку ПО</h2>
                        <form onSubmit={handleSubmitRequest}>
                            <input
                                type="text"
                                name="name"
                                value={softwareDetails.name}
                                onChange={handleInputChange}
                                placeholder="Название ПО"
                                required
                            />
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
                                name="computerNumber"
                                value={softwareDetails.computerNumber}
                                onChange={handleInputChange}
                                placeholder="Компьютер"
                                required
                            />
                            <input
                                type="text"
                                name="developer"
                                value={softwareDetails.developer}
                                onChange={handleInputChange}
                                placeholder="Разработчик"
                                required
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
                    <section className="report-section block">
                        <h2>Перечень ПО в Вашем подразделении</h2>
                        <button onClick={handleGetReport} className="report-button">Получить отчет</button>
                        {report && (
                            <div className="report-output">
                                <h3>Отчет:</h3>
                                <p>{report}</p>
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
};

export default UserPage;