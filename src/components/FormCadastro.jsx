export default function FormCadastro() {
    return (
        <div className="container-form">
            <div className="card-cadastro">
                <header className="form-header">
                    <h1>Conclua seu <br /> Cadastro</h1>
                    <img src="/icons.svg" alt="Logo Estrela" className="form-logo" />
                </header>

                <form>
                    <div className="input-group">
                        <label>Nome</label>
                        <input type="text" />
                    </div>

                    <div className="input-group">
                        <label>E-mail</label>
                        <input type="email" />
                    </div>

                    <div className="input-group">
                        <label>Data de nascimento</label>
                        <input type="text" />
                    </div>

                    <div className="input-group">
                        <label>Senha</label>
                        <input type="password" />
                    </div>

                    <button type="submit" className="btn-cadastrar">CADASTRAR</button>
                </form>

                <footer className="form-footer">
                    <p>Já tem conta? <a href="#">Faça seu login aqui</a></p>
                </footer>
            </div>
        </div>
    );
}