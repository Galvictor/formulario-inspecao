import React from 'react';
import {Button} from 'reactstrap';
import {FaFilePdf} from 'react-icons/fa';
import logo from '../assets/logo.png';
import './Header.css';
import {getAllInspecoes} from '../data/db';
import {gerarPdfsEmLote} from '../utils/pdf';

const Header = () => {
    const handleGerarTodosPDFs = async () => {
        try {
            const inspecoes = await getAllInspecoes();
            if (inspecoes.length === 0) {
                alert('Não há inspeções salvas para gerar relatórios.');
                return;
            }
            await gerarPdfsEmLote(inspecoes);
        } catch (error) {
            console.error('Erro ao gerar PDFs:', error);
            alert('Ocorreu um erro ao gerar os PDFs. Por favor, tente novamente.');
        }
    };

    return (
        <header className="app-header">
            <div className="container p-0">
                <div className="header-content">
                    <img src={logo} alt="Logo" className="header-logo"/>
                    <h1 className="header-title">Sistema de Inspeção</h1>
                    <Button
                        color="primary"
                        className="ms-auto"
                        onClick={handleGerarTodosPDFs}
                    >
                        <FaFilePdf className="me-2"/>
                        Gerar Todos PDFs
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default Header;