import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "./RecuperarSenha.module.css";
import Modal from '../components/Modal/Modal';
import FlashMessage from '../components/FlashMessage/FlashMessage';

export default function RecuperarSenha() {
    const [etapa, setEtapa] = useState(0);
    const [email, setEmail] = useState("");
    const [codigo, setCodigo] = useState(Array(6).fill(''));
    const [novaSenha, setNovaSenha] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("");
    const [modal, setModal] = useState({ active: false, message: "" });

    const inputs = useRef([]);
    const navigate = useNavigate();

    function handleChangeCode(value, index) {
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
        const nextIndex = Math.min(pasted.length, 5);
        if (inputs.current[nextIndex]) inputs.current[nextIndex].focus();
        e.preventDefault();
    }

    async function enviarEmail(e) {
        e.preventDefault();
        try {
            const resposta = await fetch("http://10.92.3.175:5000/auth/recuperar_senha", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (resposta.ok) {
                setEtapa(1);
            } else {
                setMensagem("E-mail não encontrado.");
                setTipoMensagem("erro");
            }
        } catch (error) {
            setMensagem("Erro ao conectar com o servidor.");
            setTipoMensagem("erro");
        }
    }

    async function confirmarCodigo(e) {
        e.preventDefault();
        try {
            const resposta = await fetch("http://10.92.3.175:5000/auth/recuperar_senha", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    codigo: codigo.join(''),
                    nova_senha: novaSenha
                }),
            });

            const dados = await resposta.json();
            if (!resposta.ok) {
                setMensagem(dados?.error || "Erro ao confirmar.");
                setTipoMensagem("erro");
                return;
            }

            setModal({ active: true, message: "Senha alterada com sucesso!" });
            setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
            setMensagem("Erro na comunicação.");
            setTipoMensagem("erro");
        }
    }

    return (
        <div className={styles.page}>
            {modal.active && <Modal titulo={modal.message} />}

            <FlashMessage
                mensagem={mensagem}
                tipo={tipoMensagem}
                onClose={() => setMensagem("")}
            />

            <div className={styles.cardRecuperacao}>
                <button
                    className={styles.backBtn}
                    onClick={() => etapa === 0 ? navigate("/login") : setEtapa(0)}
                >
                    <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                    </svg>
                </button>

                {etapa === 0 ? (
                    <>
                        <h1 className={styles.tituloRecuperar}>RECUPERE <br/> SUA SENHA</h1>
                        <form className={styles.formulario} onSubmit={enviarEmail}>
                            <div className={styles.inputGroup}>
                                <label>Qual seu Email ?</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className={styles.btnPrincipal}>ENVIAR E-MAIL</button>
                        </form>
                    </>
                ) : (
                    <>
                        <h1 className={styles.tituloRecuperar} style={{fontSize: '1.8rem'}}>CONFIRMAR <br/> CÓDIGO</h1>
                        <p className={styles.subtitulo}>Digite o código enviado para seu e-mail.</p>

                        <div className={styles.otpContainer}>
                            {codigo.map((digito, index) => (
                                <input
                                    key={index}
                                    ref={el => inputs.current[index] = el}
                                    type="text"
                                    maxLength={1}
                                    value={digito}
                                    onChange={e => handleChangeCode(e.target.value, index)}
                                    onKeyDown={e => handleKeyDown(e, index)}
                                    onPaste={handlePaste}
                                />
                            ))}
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Nova Senha</label>
                            <input
                                type="password"
                                placeholder="Mínimo 6 caracteres"
                                value={novaSenha}
                                onChange={e => setNovaSenha(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            className={styles.btnPrincipal}
                            onClick={confirmarCodigo}
                            disabled={codigo.filter(Boolean).length < 6 || novaSenha.length < 6}
                        >
                            CONFIRMAR
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}