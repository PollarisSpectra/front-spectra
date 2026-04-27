import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import css from "./ListarFilmes.module.css";

export default function ListarFilmes() {
    const navigate = useNavigate();
    const [filmes, setFilmes] = useState([]);
    const [ordenarAtivo, setOrdenarAtivo] = useState(false);
    const [filmeAberto, setFilmeAberto] = useState(null);
    const [ordemAtual, setOrdemAtual] = useState("recentes");

    // Função para buscar filmes usando o seu endpoint
    const buscarFilmes = async (ordem = "recentes") => {
        try {

            const response = await fetch(`http://localhost:5000/filmes/listar_filme?ordenar=${ordem}`);
            const data = await response.json();

            if (response.ok) {
                setFilmes(data.filmes);
                setOrdemAtual(ordem);
            }
        } catch (error) {
            console.error("Erro ao buscar filmes:", error);
        }
    };

    useEffect(() => {
        buscarFilmes();
    }, []);

    const toggleAccordion = (id) => {
        setFilmeAberto(filmeAberto === id ? null : id);
    };

    // Função auxiliar para definir a cor da classificação
    const getBadgeClass = (classificacao) => {
        if (classificacao === 'L') return css.badgeL;
        if (classificacao === '10') return css.badge10;
        if (classificacao === '12') return css.badge12;
        if (classificacao === '14') return css.badge14;
        return css.badge18;
    };

    return (
        <main className={css.container}>
            <header className={css.header}>
                <button className={css.voltar} onClick={() => navigate(-1)}>←</button>
                <h1 className={css.formTitulo}>FILMES</h1>
            </header>

            {/* Menu de Ordenação igual ao Figma */}
            <div className={css.ordenarWrapper}>
                <div className={css.ordenarHeader} onClick={() => setOrdenarAtivo(!ordenarAtivo)}>
                    ORDENAR POR <span>{ordenarAtivo ? "▲" : "▼"}</span>
                </div>

                {ordenarAtivo && (
                    <ul className={css.ordenarOpcoes}>
                        <li onClick={() => { buscarFilmes("recentes"); setOrdenarAtivo(false); }}>RECENTES</li>
                        <li onClick={() => { buscarFilmes("titulo"); setOrdenarAtivo(false); }}>TÍTULO (A-Z)</li>
                        <li onClick={() => { buscarFilmes("genero"); setOrdenarAtivo(false); }}>GÊNERO</li>
                        <li onClick={() => { buscarFilmes("classificacao"); setOrdenarAtivo(false); }}>CLASSIFICAÇÃO</li>
                    </ul>
                )}
            </div>

            <section className={css.lista}>
                {filmes.map((filme, index) => (
                    <div key={filme.id_filme} className={css.filmeCard}>
                        {/* Cabeçalho do Card (estilo accordion) */}
                        <div className={css.filmeHeader} onClick={() => toggleAccordion(filme.id_filme)}>
                            <div className={css.filmeLabel}>
                                FILME <span>{index + 1}</span>
                            </div>
                            <span className={css.seta}>{filmeAberto === filme.id_filme ? "▲" : "▼"}</span>
                        </div>

                        {/* Conteúdo expandido (só aparece se filmeAberto for o ID deste filme) */}
                        {filmeAberto === filme.id_filme && (
                            <div className={css.filmeDetalhes}>
                                <div className={css.posterContainer}>
                                    <img
                                        src={filme.imagem || "https://via.placeholder.com/150x220?text=Sem+Poster"}
                                        alt={filme.titulo}
                                        className={css.poster}
                                    />
                                </div>

                                <div className={css.infoGrid}>
                                    <div className={css.colEsquerda}>
                                        <h3 className={css.filmeTitulo}>{filme.titulo}</h3>
                                        <p><strong>Gênero:</strong> {filme.genero}</p>
                                        <p><strong>Duração:</strong> {filme.duracao}</p>
                                        <div className={`${css.classifBadge} ${getBadgeClass(filme.classificacao)}`}>
                                            {filme.classificacao}
                                        </div>
                                    </div>

                                    <div className={css.colDireita}>
                                        <p><strong>Data lançamento:</strong> {filme.data_lancamento}</p>
                                        <p className={css.sinopse}><strong>Sinopse:</strong> {filme.sinopse}</p>
                                    </div>

                                    <div className={css.acoes}>
                                        <button className={css.btnIcon} title="Editar">✎</button>
                                        <button className={css.btnIcon} title="Excluir">🗑</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </section>

            <button className={css.btnAdd} onClick={() => navigate("/cadastrofilme")}>
                ADICIONAR FILME <span className={css.plusCircle}>+</span>
            </button>
        </main>
    );
}