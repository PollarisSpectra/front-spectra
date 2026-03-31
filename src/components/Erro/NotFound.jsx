import Footer from "../Footer.jsx";
import css from "./NotFound.module.css";


export default function NotFound() {
    return (
        <div className={css.container}>

            <main className={css.conteudo}>
                <h1 className={css.titulo}>Erro 404</h1>
                <h2 className={css.subtitulo}>Página não encontrada</h2>
            </main>

            <Footer />

        </div>
    );
}