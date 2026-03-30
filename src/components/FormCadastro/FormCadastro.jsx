import css from './FormCadastro.module.css';

export default function FormCadastro({
                                        setCadastro,
                                     }) {



    return (
        <div className={css.containerMain}>
            {/* Imagem de fundo gigante */}
            <img src="/LogoVermelha.png" alt="" className={css.logoBackground} />

            {/* Seção do formulário alinhada à direita */}
            <div className={css.formSection}>
                <div className={css.cardCadastro}>
                    <header className={css.formHeader + " d-flex align-items-centerx"}>
                        <h1>Conclua seu <br /> Cadastro</h1>
                        <img src="/Logo-Cortada.png" alt="Logo Estrela" className={css.formLogo} />
                    </header>

                    <form>
                        <div className={css.inputGroup}>
                            <label>Nome</label>
                            <input type="text" />
                        </div>
                        <div className={css.inputGroup}>
                            <label>E-mail</label>
                            <input type="email" />
                        </div>
                        <div className={css.inputGroup}>
                            <label>Data de nascimento</label>
                            <input type="text" />
                        </div>
                        <div className={css.inputGroup}>
                            <label>Senha</label>
                            <input type="password" />
                        </div>
                        <button onClick={() => setCadastro(true)} type="button" className={css.btnCadastrar}>CADASTRAR</button>
                    </form>

                    <footer className={css.formFooter}>
                        <p>Já tem conta? <a className={css.linkLogin} href="#">Faça seu login aqui</a></p>
                    </footer>
                </div>
            </div>
        </div>
    );
}