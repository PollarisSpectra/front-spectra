import css from './FormLogin.module.css';

export default function FormLogin() {
    return (
        <div className={css.containerMain}>
            {/* Imagem de fundo gigante (mesma lógica do cadastro) */}
            <img src="/LogoVermelha.png" alt="" className={css.logoBackground} />

            {/* Seção do formulário alinhada à direita */}
            <div className={css.formSection}>
                <div className={css.cardCadastro}>
                    <header className={css.formHeader}>
                        <h1>Bem-vindo <br /> de Volta!!!</h1>
                        <img src="/Logo-Cortada.png" alt="Logo Estrela" className={css.formLogo} />
                    </header>

                    <form>
                        <div className={css.inputGroup}>
                            <label>E-mail</label>
                            <input type="email" />
                        </div>

                        <div className={css.inputGroup}>
                            <label>Senha</label>
                            <input type="password" />
                        </div>

                        {/* Link de recuperar senha que tem no seu print de login */}
                        <div className={css.esquecerSenha}>
                            <span>Esqueceu sua senha? </span>
                            <a href="#">Recuperar</a>
                        </div>

                        <button type="submit" className={css.btnCadastrar}>ENTRAR</button>
                    </form>
                </div>
            </div>
        </div>
    );
}