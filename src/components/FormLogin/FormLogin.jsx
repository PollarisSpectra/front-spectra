import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom'; // Adicione este import no topo
import css from './FormLogin.module.css';
import FlashMessage from "../FlashMessage/FlashMessage";

export default function FormLogin({ setCadastro, usuario, setUsuario }) {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("");

    const navigate = useNavigate();

    async function fazerLogin(e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append("email", email);
        formData.append("senha", senha);

        try {
            const resposta = await fetch("http://localhost:5000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    senha
                })
            });

            const dados = await resposta.json();

            if (resposta.ok) {
                setMensagem("Login realizado com sucesso!");
                setTipoMensagem("sucesso");
                setCadastro(true);

                localStorage.setItem("usuario", JSON.stringify(dados.usuario));
                setUsuario(localStorage.getItem("usuario"));


                setEmail("");
                setSenha("");

                setTimeout(() => {
                    navigate("/dashboard");
                }, 2000)
            } else {
                setMensagem(dados.error || dados.message || "Erro no login");
                setTipoMensagem("error");
            }
        } catch (erro) {
            setMensagem("Erro ao conectar com a API");
            setTipoMensagem("error");
        }
    }

    return (
        <div className={css.containerMain}>
            <FlashMessage mensagem={mensagem} tipo={tipoMensagem} />
            
            <img src="/badwinlogin.png" alt="Background" className={css.logoBackground} />

            <div className={css.formSection}>
                <div className={css.cardCadastro}>
                    <header className={css.formHeader}>
                        <h1>Bem-vindo <br /> de Volta!!!</h1>
                        <img src="/Logo-Cortada.png" alt="Logo Estrela" className={css.formLogo} />
                    </header>

                    <form onSubmit={fazerLogin}>
                        <div className={css.inputGroup}>
                            <label>E-mail</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className={css.inputGroup}>
                            <label>Senha</label>
                            <input
                                type="password"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                            />
                        </div>

                        <div className={css.esquecerSenha}>
                            <span>Esqueceu sua senha? </span>
                            <Link className={css.linkLogin} to="/recuperar-senha">Recuperar</Link>
                        </div>

                        <button type="submit" className={css.btnCadastrar}>
                            ENTRAR
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}