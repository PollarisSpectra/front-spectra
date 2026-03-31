import { useState } from "react";
import css from './FormLogin.module.css';

export default function FormLogin({ setCadastro }) {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [mensagem, setMensagem] = useState("");

    async function fazerLogin(e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append("email", email);
        formData.append("senha", senha);

        try {
            const resposta = await fetch("http://127.0.0.1:5000/login", {
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
                setCadastro(true);

                // opcional: salvar usuário
                localStorage.setItem("usuario", JSON.stringify(dados.usuario));

                setEmail("");
                setSenha("");
            } else {
                setMensagem(dados.error || dados.message || "Erro no login");
            }
        } catch (erro) {
            setMensagem("Erro ao conectar com a API");
        }
    }

    return (
        <div className={css.containerMain}>
            <img src="/LogoVermelha.png" alt="" className={css.logoBackground} />

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
                            <a className={css.linkLogin} href="#">Recuperar</a>
                        </div>

                        <button type="submit" className={css.btnCadastrar}>
                            ENTRAR
                        </button>
                    </form>

                    {mensagem && <p>{mensagem}</p>}
                </div>
            </div>
        </div>
    );
}