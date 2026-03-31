import { useState, useEffect, useRef } from "react"; // Adicionado useRef
import css from './FormCadastro.module.css';

export default function FormCadastro({ setEtapa }) {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [senha, setSenha] = useState("");
    const [mensagem, setMensagem] = useState("");

    // Novas variáveis de estado para a foto de perfil
    const [fotoPerfil, setFotoPerfil] = useState(null);
    const [previewFoto, setPreviewFoto] = useState(null);
    const inputFotoRef = useRef(null); // Referência para o input de arquivo escondido

    // Efeito para limpar a mensagem flash
    useEffect(() => {
        if (mensagem) {
            const timer = setTimeout(() => { setMensagem(""); }, 5000);
            return () => clearTimeout(timer);
        }
    }, [mensagem]);

    // Função para lidar com a seleção da imagem
    function handleFotoChange(e) {
        const arquivo = e.target.files[0];
        if (arquivo) {
            setFotoPerfil(arquivo);
            // Cria uma URL temporária para mostrar o preview na tela
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewFoto(reader.result);
            };
            reader.readAsDataURL(arquivo);
        }
    }

    async function cadastrarUsuario(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append("nome", nome);
        formData.append("email", email);
        formData.append("data_nascimento", dataNascimento);
        formData.append("senha", senha);

        // Adiciona a foto ao FormData se houver
        if (fotoPerfil) {
            formData.append("foto_perfil", fotoPerfil);
        }

        try {
            const resposta = await fetch("http://127.0.0.1:5000/cadastro_usuario", {
                method: "POST",
                body: formData
            });
            const dados = await resposta.json();

            if (resposta.ok) {
                setMensagem("USUÁRIO CADASTARDO COM SUCESSO!");
                setEtapa(1);
            } else {
                setMensagem(dados.error || dados.message || "ERRO AO CADASTRAR");
            }
        } catch (erro) {
            setMensagem("ERRO AO CONECTAR COM A API");
        }
    }

    return (
        <div className={css.containerMain}>
            {}
            <div className={css.imageWrapper}>
                <img src="/cadastro.png" alt="Tony Montana" className={css.backgroundImg} />
                {}
                <div className={css.radialOverlay}></div>
            </div>

            <div className={css.formSection}>
                <div className={css.cardCadastro}>
                    {}
                    {mensagem && ( <div className={css.flashMessage}>{mensagem}</div> )}

                    <header className={css.formHeader + " d-flex align-items-center justify-content-between"}>
                        <h1>Conclua seu <br /> Cadastro</h1>
                        <img src="/Logo-Cortada.png" alt="Logo Estrela" className={css.formLogo} />
                    </header>

                    {/* 2. NOVO CAMPO DE ADICIONAR FOTO DE PERFIL (Figma style) */}
                    <div className={css.fotoPerfilSection}>
                        <p className={css.fotoPerfilTitle}>ADICIONE UMA FOTO <br /> DE PERFIL</p>

                        {/* Input de arquivo escondido */}
                        <input
                            type="file"
                            accept="image/*"
                            ref={inputFotoRef}
                            style={{ display: 'none' }}
                            onChange={handleFotoChange}
                        />

                        {/* Área clicável do upload */}
                        <div className={css.fotoUploadArea} onClick={() => inputFotoRef.current.click()}>
                            {previewFoto ? (
                                <img src={previewFoto} alt="Preview Foto de Perfil" className={css.fotoPreview} />
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#666" viewBox="0 0 16 16">
                                    <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                                    <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
                                </svg>
                            )}
                        </div>
                    </div>

                    <form onSubmit={cadastrarUsuario}>
                        {/* Seus inputs originais aqui... */}
                        <div className={css.inputGroup}><label>Nome</label><input type="text" value={nome} onChange={(e) => setNome(e.target.value)} /></div>
                        <div className={css.inputGroup}><label>E-mail</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                        <div className={css.inputGroup}><label>Data de nascimento</label><input type="text" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} /></div>
                        <div className={css.inputGroup}><label>Senha</label><input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} /></div>

                        <button type="submit" className={css.btnCadastrar}>CADASTRAR</button>
                    </form>

                    <footer className={css.formFooter}>
                        <p>Já tem conta? <a className={css.linkLogin} href="#">Faça seu login aqui</a></p>
                    </footer>
                </div>
            </div>
        </div>
    );
}