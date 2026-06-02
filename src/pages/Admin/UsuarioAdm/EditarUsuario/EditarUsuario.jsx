import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import css from "./EditarUsuario.module.css";
import FlashMessage from "../../../../components/FlashMessage/FlashMessage.jsx";

export default function EditarUsuario() {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    const usuarioRecebido = location.state?.usuario;

    const [nome, setNome] = useState(usuarioRecebido?.nome || "");
    const [email, setEmail] = useState(usuarioRecebido?.email || "");
    const [tipo, setTipo] = useState(usuarioRecebido?.tipo || 1);
    const [dataNascimento, setDataNascimento] = useState(usuarioRecebido?.data_nascimento || "");
    const [senha, setSenha] = useState("");

    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("");

    const salvar = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("nome", nome);
        formData.append("email", email);
        formData.append("data_nascimento", dataNascimento);

        if (senha) {
            formData.append("senha", senha);
        }

        try {
            const response = await fetch(`http://localhost:5000/usuarios/${id}`, {
                method: "PUT",
                credentials: "include",
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                setMensagem("Usuário editado com sucesso!");
                setTipoMensagem("sucesso");

                setTimeout(() => {
                    navigate("/app/usuarios");
                }, 1200);
            } else {
                setMensagem(data.error || "Erro ao editar usuário.");
                setTipoMensagem("erro");
            }
        } catch (error) {
            setMensagem("Erro de conexão com o servidor.");
            setTipoMensagem("erro");
        }
    };

    return (
        <main className={css.container}>
            <FlashMessage
                mensagem={mensagem}
                tipo={tipoMensagem}
                onClose={() => {
                    setMensagem("");
                    setTipoMensagem("");
                }}
            />

            <section className={css.header}>
                <button className={css.voltar} onClick={() => navigate("/app/usuarios")}>
                    ←
                </button>

                <h1 className={css.titulo}>EDITAR USUÁRIO</h1>
            </section>

            <form onSubmit={salvar} className={css.formulario}>
                <div className={css.inputGroup}>
                    <label>Nome</label>
                    <input
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                    />
                </div>

                <div className={css.inputGroup}>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>


                <div className={css.inputGroup}>
                    <label>Data de nascimento</label>
                    <input
                        type="date"
                        value={dataNascimento}
                        onChange={(e) => setDataNascimento(e.target.value)}
                    />
                </div>

                <div className={css.inputGroup}>
                    <label>Nova senha</label>
                    <input
                        type="password"
                        placeholder="Deixe vazio para não alterar"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                    />
                </div>

                <button type="submit" className={css.btnSalvar}>
                    SALVAR ALTERAÇÕES
                </button>
            </form>
        </main>
    );
}