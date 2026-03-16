import './FormLogin.css';

export default function FormLogin() {
    return (
        <div className="container-login">
            <div className="card-login">
                <header className="login-header">
                    <h1>Bem-vindo <br /> de Volta!!!</h1>
                    <img src="/icons.svg" alt="Logo Estrela" className="login-logo" />
                </header>

                <form>
                    <div className="input-group">
                        <label>E-mail</label>
                        <input type="email" />
                    </div>

                    <div className="input-group">
                        <label>Senha</label>
                        <input type="password" />
                    </div>

                    <div className="esquecer-senha">
                        <p>Esqueceu sua senha? <a href="#">Recuperar</a></p>
                    </div>

                    <button type="submit" className="btn-entrar">ENTRAR</button>
                </form>
            </div>
        </div>
    );
}