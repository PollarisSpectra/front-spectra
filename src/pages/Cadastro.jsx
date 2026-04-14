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
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("");

    const navigate = useNavigate();

    async function validarEmail() {
        const retorno = await fetch("http://10.92.3.175:5000/auth/validar_email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                'email': email,
                'codigo': codigo.join('')
            })
        });

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
            {modal && <Modal titulo={"Email confirmado com sucesso"} />}
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
                <div className={styles.page}>
                    <div className={styles.cardValidacao}>

                        <button
                            className={styles.backBtn}
                            onClick={() => setEtapa(0)}
                        >
                            <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                            </svg>
                        </button>

                        <h1 className={styles.tituloValidar}>
                            VALIDAR <br /> EMAIL
                        </h1>

                        <p className={styles.subtitulo}>
                            Digite o código de 6 dígitos enviado para o seu e-mail.
                        </p>

                        <span className={styles.labelCodigo}>Código</span>

                        <div className={styles.otpContainer}>
                            {codigo.map((digito, index) => (
                                <input
                                    key={index}
                                    ref={el => inputs.current[index] = el}
                                    className={`${styles.otpInput}${digito ? ` ${styles.filled}` : ''}`}
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
                            className={styles.confirmBtn}
                            disabled={filled < 6}
                        >
                            CONFIRMAR
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}