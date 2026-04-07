import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import FlashMessage from "../FlashMessage/FlashMessage.jsx"; // Importe o componente
import css from './FormLogin.module.css';

export default function FormLogin({ setCadastro }) {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState(""); // Novo estado para definir cor (erro ou sucesso)

    const navigate = useNavigate();

    async function fazerLogin(e) {
        e.preventDefault();

        try {
            const resposta = await fetch("http://10.92.3.120:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, senha })
            });

            const dados = await resposta.json();

            if (resposta.ok) {
                setMensagem("Login realizado com sucesso!");
                setTipoMensagem("sucesso"); // Define como sucesso
                setCadastro(true);

                localStorage.setItem("usuario", JSON.stringify(dados.usuario));

                setTimeout(() => {
                    navigate("/dashboard");
                }, 2000);
            } else {
                // Caso o usuário não tenha confirmado e-mail ou senha errada
                setMensagem(dados.error || dados.message || "Erro no login");
                setTipoMensagem("erro");
            }
        } catch (erro) {
            setMensagem("Erro ao conectar com a API");
            setTipoMensagem("erro");
        }
    }

    return (
        <div className={css.containerMain}>
            {/* O FlashMessage deve ficar aqui para aparecer sobre o fundo */}
            <FlashMessage
                mensagem={mensagem}
                tipo={tipoMensagem}
                onClose={() => setMensagem("")}
            />

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
                                required
                            />
                        </div>

                        <div className={css.inputGroup}>
                            <label>Senha</label>
                            <input
                                type="password"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
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

                    {/* Remova o <p>{mensagem}</p> antigo daqui */}
                </div>
            </div>
        </div>
    );
}