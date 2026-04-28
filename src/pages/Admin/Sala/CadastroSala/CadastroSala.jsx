import { useState } from "react";
import css from "./CadastroSala.module.css";

export default function CadastroSala() {
    const [sala, setSala] = useState({
        nome: "",
        fileiras: 0,
        colunas: 0,
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' }); // '', 'success', 'error'

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (["fileiras", "colunas"].includes(name)) {
            const val = Math.max(0, parseInt(value) || 0);
            const max = name === "fileiras" ? 26 : 28;
            setSala({ ...sala, [name]: Math.min(val, max) });
        } else {
            setSala({ ...sala, [name]: value });
        }
    };

    const getLetra = (index) => String.fromCharCode(65 + index);

    const renderCadeiras = () => {
        const totalFileiras = Math.max(0, parseInt(sala.fileiras) || 0);
        const totalColunas = Math.max(0, parseInt(sala.colunas) || 0);

        return Array.from({ length: totalFileiras }).map((_, fIndex) => (
            <div key={fIndex} className={css.fila}>
                <span className={css.letraFila}>{getLetra(fIndex)}</span>
                <div className={css.assentosContainer}>
                    {Array.from({ length: totalColunas }).map((_, cIndex) => (
                        <div key={cIndex} className={css.assento}>
                            {cIndex + 1}
                        </div>
                    ))}
                </div>
            </div>
        ));
    };

    const handleCadastrar = async () => {
        if (!sala.nome.trim() || sala.fileiras === 0 || sala.colunas === 0) {
            setMessage({ text: 'Todos os campos são obrigatórios!', type: 'error' });
            return;
        }

        setLoading(true);
        setMessage({ text: '', type: '' });



        try {
            const response = await fetch('http://localhost:5000/salas/cadastro_sala', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome: sala.nome.trim(),
                    qtd_fileiras: sala.fileiras,
                    qtd_colunas: sala.colunas
                }),
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ text: data.message, type: 'success' });
                setSala({ nome: "", fileiras: 0, colunas: 0 });
            } else {
                setMessage({ text: data.error, type: 'error' });
            }
        } catch (error) {
            setMessage({ text: 'Erro de conexão com o servidor', type: 'error' });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={css.mainContainer}>
            <div className={css.cardCadastro}>
                <h1 className={css.titulo}>CADASTRO DE SALA</h1>

                <div className={css.formulario}>
                    {message.text && (
                        <div className={`${css.messageBox} ${css[message.type]}`} style={{
                            padding: '12px 16px',
                            marginBottom: '20px',
                            borderRadius: '8px',
                            border: '1px solid',
                            fontWeight: '500'
                        }}>
                            {message.text}
                        </div>
                    )}

                    <div className={css.inputBox}>
                        <label>Nome *</label>
                        <input
                            type="text"
                            name="nome"
                            value={sala.nome}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={css.inputBox}>
                        <label>Quantidade de Fileiras (Máx: 26) *</label>
                        <input
                            type="number"
                            min="1"
                            name="fileiras"
                            max="26"
                            value={sala.fileiras}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={css.inputBox}>
                        <label>Quantidade de Colunas (Máx: 28) *</label>
                        <input
                            type="number"
                            min="1"
                            name="colunas"
                            max="28"
                            value={sala.colunas}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={css.mapaAssentos}>
                        {sala.fileiras > 0 && sala.colunas > 0 ? (
                            renderCadeiras()
                        ) : (
                            <p className={css.placeholder}>Defina o tamanho da sala para visualizar o mapa de assentos</p>
                        )}
                    </div>

                    <button 
                        className={css.btnCadastrar}
                        onClick={handleCadastrar}
                        disabled={loading}
                    >
                        {loading ? 'CADASTRANDO...' : 'CADASTRAR SALA'}
                    </button>
                </div>
            </div>
        </div>
    );
}