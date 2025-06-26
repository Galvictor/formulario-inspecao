import FormularioInspecao from './components/FormularioInspecao';
import Header from './components/Header';
import './App.css';

function App() {
    return (
        <>
            <Header/>
            <div className="main-content">
                <div className="container">
                    <FormularioInspecao/>
                </div>
            </div>
        </>
    );
}

export default App;