import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import css from './FormCadastro.module.css';
import FlashMessage from '../FlashMessage/FlashMessage';

export default function FormCadastro({ setEtapa, setEmail, email, mensagem, setMensagem }) {
    const [nome, setNome] = useState("");
    const [senha, setSenha] = useState("");

    // Estados para os Dropdowns de Data
    const [dia, setDia] = useState("");
    const [mes, setMes] = useState("");
    const [ano, setAno] = useState("");

    const [fotoPerfil, setFotoPerfil] = useState(null);
    const [previewFoto, setPreviewFoto] = useState(null);
    const inputFotoRef = useRef(null);

    // Geradores de opções
    const dias = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
    const meses = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
    const anos = Array.from({ length: 100 }, (_, i) => String(new Date().getFullYear() - i));

    useEffect(() => {
        if (mensagem.mensagem) {
            const timer = setTimeout(() => {
                setMensagem({ mensagem: "", tipoMensagem: "" });
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [mensagem]);

    function handleFotoChange(e) {
        const arquivo = e.target.files[0];
        if (arquivo) {
            setFotoPerfil(arquivo);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewFoto(reader.result);
            reader.readAsDataURL(arquivo);
        }
    }

    async function cadastrarUsuario(e) {
        e.preventDefault();

        if (!dia || !mes || !ano) {
            setMensagem({ mensagem: "Selecione a data completa.", tipoMensagem: "erro" });
            return;
        }

        const dataParaOBackEnd = `${ano}-${mes}-${dia}`;
        const formData = new FormData();
        formData.append("nome", nome);
        formData.append("email", email);
        formData.append("data_nascimento", dataParaOBackEnd);
        formData.append("senha", senha);

        if (fotoPerfil) {
            formData.append("foto_perfil", fotoPerfil);
        }

        try {
            const resposta = await fetch("http://10.92.3.117:5000/cadastro_usuario", {
                method: "POST",
                body: formData
            });

            const dados = await resposta.json();

            if (resposta.ok) {
                setMensagem({ mensagem: "USUÁRIO CADASTRADO COM SUCESSO!", tipoMensagem: "sucesso" });
                setTimeout(() => setEtapa(1), 2000);
            } else {
                setMensagem({ mensagem: dados.error || dados.message || "ERRO AO CADASTRAR", tipoMensagem: "erro" });
            }
        } catch (error) {
            setMensagem({ mensagem: "ERRO AO CONECTAR COM A API", tipoMensagem: "erro" });
        }
    }

    return (
        <div className={css.containerMain}>
            <div className={css.imageWrapper}>
                <img src="/cadastro.png" alt="Background" className={css.backgroundImg} />
                <div className={css.radialOverlay}></div>
            </div>

            <div className={css.formSection}>
                <div className={css.cardCadastro}>

                    <FlashMessage
                        mensagem={mensagem.mensagem}
                        tipo={mensagem.tipoMensagem}
                        onClose={() => setMensagem({ mensagem: "", tipoMensagem: "" })}
                    />

                    <header className={css.formHeader}>
                        <h1>Conclua seu <br /> Cadastro</h1>
                        <img src="/Logo-Cortada.png" alt="Logo" className={css.formLogo} />
                    </header>

                    <div className={css.fotoPerfilSection}>
                        <p className={css.fotoPerfilTitle}>ADICIONE UMA FOTO <br /> DE PERFIL</p>
                        <input
                            type="file"
                            accept="image/*"
                            ref={inputFotoRef}
                            style={{ display: 'none' }}
                            onChange={handleFotoChange}
                        />
                        <div className={css.fotoUploadArea} onClick={() => inputFotoRef.current.click()}>
                            {previewFoto ? (
                                <img src={previewFoto} alt="Preview" className={css.fotoPreview} />
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#999" viewBox="0 0 16 16">
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                                </svg>
                            )}
                        </div>
                    </div>

                    <form onSubmit={cadastrarUsuario}>
                        <div className={css.inputGroup}>
                            <label>Nome</label>
                            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
                        </div>

                        <div className={css.inputGroup}>
                            <label>E-mail</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className={css.inputGroup}>
                            <label>Data de nascimento</label>
                            <div className={css.dataContainer}>
                                <select className={css.dataSelect} value={dia} onChange={(e) => setDia(e.target.value)} required>
                                    <option value="">Dia</option>
                                    {dias.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                                <select className={css.dataSelect} value={mes} onChange={(e) => setMes(e.target.value)} required>
                                    <option value="">Mês</option>
                                    {meses.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                                <select className={css.dataSelect} value={ano} onChange={(e) => setAno(e.target.value)} required>
                                    <option value="">Ano</option>
                                    {anos.map(a => <option key={a} value={a}>{a}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className={css.inputGroup}>
                            <label>Senha</label>
                            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
                        </div>

                        <button type="submit" className={css.btnCadastrar}>CADASTRAR</button>
                    </form>

                    <footer className={css.formFooter}>
                        <p>Já tem conta? <Link to="/login">Faça seu login aqui</Link></p>
                    </footer>
                </div>
            </div>
        </div>
    );
}