import { useState } from "react";
import css from './FormCadastro.module.css';

export default function FormCadastro({ setEtapa }) {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [senha, setSenha] = useState("");
    const [mensagem, setMensagem] = useState("");

    async function cadastrarUsuario(e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append("nome", nome);
        formData.append("email", email);
        formData.append("data_nascimento", dataNascimento);
        formData.append("senha", senha);

        try {
            const resposta = await fetch("http://127.0.0.1:5000/cadastro_usuario", {
                method: "POST",
                body: formData
            });

            const dados = await resposta.json();

            if (resposta.ok) {
                setMensagem("Usuário cadastrado com sucesso!");
                setEtapa(1);

                setNome("");
                setEmail("");
                setDataNascimento("");
                setSenha("");
            } else {
                setMensagem(dados.error || dados.message || "Erro ao cadastrar");
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
                    <header className={css.formHeader + " d-flex align-items-centerx"}>
                        <h1>Conclua seu <br /> Cadastro</h1>
                        <img src="/Logo-Cortada.png" alt="Logo Estrela" className={css.formLogo} />
                    </header>

                    <form onSubmit={cadastrarUsuario}>
                        <div className={css.inputGroup}>
                            <label>Nome</label>
                            <input
                                type="text"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                            />
                        </div>

                        <div className={css.inputGroup}>
                            <label>E-mail</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className={css.inputGroup}>
                            <label>Data de nascimento</label>
                            <input
                                type="text"
                                value={dataNascimento}
                                onChange={(e) => setDataNascimento(e.target.value)}
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

                        <button type="submit" className={css.btnCadastrar}>
                            AVANÇAR
                        </button>
                    </form>

                    {mensagem && <p>{mensagem}</p>}

                    <footer className={css.formFooter}>
                        <p>
                            Já tem conta?{" "}
                            <a className={css.linkLogin} href="#">
                                Faça seu login aqui
                            </a>
                        </p>
                    </footer>
                </div>
            </div>
        </div>
    );
}