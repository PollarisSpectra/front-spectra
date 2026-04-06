import { useState, useRef } from "react";
import FormCadastro from "../components/FormCadastro/FormCadastro.jsx";
import styles from "./Cadastro.module.css";
import Modal from "../components/Modal/Modal.jsx"
import { useNavigate } from "react-router-dom";
import FlashMessage from "../components/FlashMessage/FlashMessage.jsx";

export default function Cadastro() {
    const [etapa, setEtapa] = useState(0);
    const [codigo, setCodigo] = useState(Array(6).fill(''));
    const [email, setEmail] = useState("");
    const [modal, setModal] = useState(false);
    const inputs = useRef([]);
    // const [mensagem, setMensagem] = useState("");
    // const [tipoMensagem, setTipoMensagem] = useState("");

    const [mensagem, setMensagem] = useState({
        "mensagem": "",
        "tipoMensagem": ""
    });

    const navigate = useNavigate();

    async function validarEmail() {
        const retorno = await fetch("http://127.0.0.1:5000/validar_email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                'email': email,
                'codigo': codigo.join('')
            })
        })
        
        if (retorno.ok) {
            setModal(true);

            setTimeout(() => {
                setModal(false);
                navigate("/login");
            }, 2500);
        }
    }

    function handleChange(value, index) {
        if (!/^\d?$/.test(value)) return;
        const novo = [...codigo];
        novo[index] = value;
        setCodigo(novo);
        if (value && index < 5) inputs.current[index + 1].focus();
    }

    function handleKeyDown(e, index) {
        if (e.key === 'Backspace' && !codigo[index] && index > 0) {
            inputs.current[index - 1].focus();
        }
    }

    function handlePaste(e) {
        const pasted = e.clipboardData.getData('text').slice(0, 6).split('');
        if (pasted.some(c => !/\d/.test(c))) return;
        const novo = Array(6).fill('');
        pasted.forEach((c, i) => novo[i] = c);
        setCodigo(novo);
        inputs.current[Math.min(pasted.length, 5)].focus();
        e.preventDefault();
    }

    const filled = codigo.filter(Boolean).length;

    return (
        <>
        {modal && <Modal />}
        <FlashMessage
            mensagem={mensagem}
            tipo={tipoMensagem}
            onClose={() => {
                setMensagem("");
                setTipoMensagem("");
            }}
        />
        {etapa === 0 ? (
        <div>
            <FormCadastro
                setEmail={setEmail}
                email={email}
                setEtapa={setEtapa}
                mensagem={mensagem}
                setMensagem={setMensagem}
            />
        </div>
        ) : (
        <div className={`d-flex flex-column min-vh-100 ${styles.page}`}>
            <main className="flex-grow-1 d-flex align-items-center justify-content-center py-5 px-3">
                <div className="text-center w-100" style={{ maxWidth: '360px' }}>

                    <button className={`${styles.backBtn} mb-4`} onClick={() => setEtapa(0)}>
                        ← Voltar
                    </button>

                    <h2 className={`${styles.fontMontserrat} fw-bold text-white text-uppercase mb-4`}
                        style={{ fontSize: '1.15rem', letterSpacing: '0.12em' }}>
                        Validar Email
                    </h2>

                    <p className={`${styles.fontInter} text-secondary mb-4`}
                        style={{ fontSize: '0.78rem', lineHeight: 1.5 }}>
                        Digite o código de 6 dígitos enviado para o seu e-mail.
                    </p>

                    <span className={`${styles.fontMontserrat} text-uppercase text-secondary d-block mb-3`}
                        style={{ fontSize: '0.72rem', letterSpacing: '0.1em' }}>
                        Código
                    </span>

                    <div className="d-flex justify-content-center gap-2 mb-3">
                        {codigo.map((digito, index) => (
                            <input
                                key={index}
                                ref={el => inputs.current[index] = el}
                                className={`${styles.otpInput} text-center rounded-2${digito ? ` ${styles.filled}` : ''}`}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digito}
                                onChange={e => handleChange(e.target.value, index)}
                                onKeyDown={e => handleKeyDown(e, index)}
                                autoComplete="none"
                                onPaste={handlePaste}
                            />
                        ))}
                    </div>

                    <button
                        onClick={validarEmail}
                        className={`${styles.confirmBtn} ${styles.bgRed} btn text-white rounded-1 w-100 py-2 text-uppercase`}
                        disabled={filled < 6}
                    >
                        CONFIRMAR
                    </button>

                    {/* <p className={`${styles.fontInter} mt-3 mb-0`} style={{ fontSize: '0.72rem', color: '#555' }}>
                        Não recebeu?{' '}
                        <span className={styles.textRed} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
                            Reenviar código
                        </span>
                    </p> */}
                </div>
            </main>
        </div>
        )}
        </>
    );
}