import React, {useRef, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from "./Cadastro.module.css";
import Modal from '../components/Modal/Modal';
import FlashMessage from '../components/FlashMessage/FlashMessage';

export default function RecuperarSenha() {
    const [etapa, setEtapa] = useState(0);
    const [email, setEmail] = useState("");
    const [codigo, setCodigo] = useState(Array(6).fill(''));
    const inputs = useRef([]);
    const [novaSenha, setNovaSenha] = useState("");
    const [modal, setModal] = useState({
        "active": false,
        "message": "",
    });
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("");

    const navigate = useNavigate();

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

    async function recuperarSenha(e) {
        e.preventDefault();

        try {
            const resposta = await fetch("http://10.92.3.121:5000/recuperar_senha", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "email": email,
                }),
            })

            if (resposta.ok) {
                setEtapa(1);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function confirmarCodigo() {
        try {
            const resposta = await fetch("http://127.0.0.1:5000/recuperar_senha", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "email": email,
                    "codigo": codigo.join(''),
                    "nova_senha": novaSenha
                }),
            })

            const dados = await resposta.json();
            const erro = dados?.error;

            if (!resposta.ok) {
                setMensagem(erro || "Houve um erro ao confirmar código");
                setTipoMensagem("erro")
                return;
            }

            setModal({'active': true, 'message': "Código confirmado com sucesso"})

            setTimeout(() => {
                navigate("/login");
            }, 2000)
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
        {modal.active && <Modal titulo={modal.message} />}
        {
        etapa === 0 ? (
            <main className="d-flex align-items-start justify-content-center"
              style={{
                  minHeight: '100vh',
                  backgroundColor: '#000',
                  paddingTop: '60px',
                  paddingBottom: '80px'
              }}>

            <div className="container" style={{ maxWidth: '500px', position: 'relative' }}>

                <Link to="/login" className="position-absolute" style={{ left: '-50px', top: '12px', color: 'white' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                    </svg>
                </Link>

                <div className="text-center text-white">
                    <h1 className="fw-bold" style={{
                        fontSize: '2.5rem',
                        letterSpacing: '1.5px',
                        lineHeight: '1.1',
                        marginBottom: '90px'
                    }}>
                        RECUPERAÇÃO DE <br /> SENHA
                    </h1>

                    <form className="d-flex flex-column align-items-center" onSubmit={recuperarSenha}>
                        <div className="text-start mb-5 w-100">
                            {/* Label: REDUZIDO */}
                            <label className="fw-bold mb-1" style={{ fontSize: '1rem', color: '#ccc' }}>Email</label>

                            {/* Input: REDUZIDO (fs-5 -> fs-6) */}
                            <input
                                type="email"
                                className="form-control bg-transparent border-0 border-bottom rounded-0 text-white p-0 fs-6"
                                style={{
                                    borderColor: '#fff !important',
                                    boxShadow: 'none',
                                    paddingBottom: '10px'
                                }}
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn fw-bold mt-3"
                            style={{
                                backgroundColor: '#ff1a1a',
                                color: 'white',
                                borderRadius: '0px',
                                fontSize: '0.95rem',
                                padding: '14px 0',
                                width: '260px',
                                letterSpacing: '1px'
                            }}
                        >
                            ENVIAR E-MAIL
                        </button>
                    </form>
                </div>
            </div>
        </main>
        ) : (
            <div className={`d-flex flex-column min-vh-100 ${styles.page}`}>
                <main className="flex-grow-1 d-flex align-items-center justify-content-center py-5 px-3">
                    <FlashMessage
                        mensagem={mensagem}
                        tipo={tipoMensagem}
                        onClose={() => {
                            setMensagem("");
                            setTipoMensagem("");
                        }}
                    />
                    <div className="text-center w-100" style={{ maxWidth: '360px' }}>

                        <button className={`${styles.backBtn} mb-4`} onClick={() => setEtapa(0)}>
                            ← Voltar
                        </button>

                        <h2 className={`${styles.fontMontserrat} fw-bold text-white text-uppercase mb-4`}
                            style={{ fontSize: '1.15rem', letterSpacing: '0.12em' }}>
                            Confirmar Código
                        </h2>

                        <p className={`${styles.fontInter} text-secondary mb-4`}
                           style={{ fontSize: '0.78rem', lineHeight: 1.5 }}>
                            Digite o código de recuperação de 6 dígitos enviado para o seu e-mail.
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

                        <input
                            className={`${styles.pswInput} w-100 rounded-2 mb-4 px-2 py-0`}
                            type="password"
                            placeholder={"Sua nova senha aqui..."}
                            value={novaSenha}
                            onChange={e => setNovaSenha(e.target.value)}
                            autoComplete="none"
                            onPaste={handlePaste}
                        />

                        <button
                            onClick={confirmarCodigo}
                            className={`${styles.confirmBtn} ${styles.bgRed} btn text-white rounded-1 w-100 py-2 text-uppercase`}
                            disabled={filled < 6}
                        >
                            CONFIRMAR
                        </button>

                        {/*<p className={`${styles.fontInter} mt-3 mb-0`} style={{ fontSize: '0.72rem', color: '#555' }}>*/}
                        {/*    Não recebeu?{' '}*/}
                        {/*    <span className={styles.textRed} style={{ cursor: 'pointer', textDecoration: 'underline' }}>*/}
                        {/*        Reenviar código*/}
                        {/*    </span>*/}
                        {/*</p>*/}
                    </div>
                </main>
            </div>
        )
        }
        </>
    );
}