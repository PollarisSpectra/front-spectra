import estilo from './Card.module.css';
import Botao from './Botao';

export default function Card({
                                 imagem,
                                 classificacao,
                                 titulo,
                                 estrelas = 5,
                                 horario
                             }) {

    // Cor de fundo com base na classificação
    const getClassificacaoStyle = (idade) => {
        if (idade === '18') return estilo.bgPreto;
        if (idade === '10') return estilo.bgAzul;
        if (idade === '16') return estilo.bgVermelho;
        if (idade === '14') return estilo.bgLaranja;
        if (idade === '12') return estilo.bgAmarelo;
        return estilo.bgPadrao;
    };

    const getTamanhoFonte = (texto) => {
        if (texto.length > 22) return '11px'; // Títulos muito grandes
        if (texto.length > 15) return '13px'; // Títulos médios
        return '15px'; // Títulos curtos (tamanho padrão original)
    };

    return (
        <div className={estilo.card}>
            <div className={estilo.containerImagem}>
                <img src={imagem} alt={`Pôster do filme ${titulo}`} className={estilo.imagem} />

                {classificacao && (
                    <div className={`${estilo.badgeClassificacao} ${getClassificacaoStyle(classificacao)}`}>
                        {classificacao}
                    </div>
                )}
            </div>

            <div className={estilo.infos}>
                <div className={estilo.linhaPrincipal}>
                    <h3
                        className={estilo.titulo}
                        style={{ fontSize: getTamanhoFonte(titulo) }}
                    >
                        {titulo}
                    </h3>

                    {/* Estrelas e horário lado a lado */}
                    <div className={estilo.detalhesSecundarios}>
                        <div className={estilo.estrelas} aria-label={`${estrelas} estrelas`}>
                            {'★'.repeat(estrelas)}
                            {'☆'.repeat(5 - estrelas)}
                        </div>

                        <p className={estilo.horario}>{horario}</p>
                    </div>
                </div>
            </div>

            <div className={estilo.containerBotao}>
                <Botao texto="VER DETALHES" />
            </div>
        </div>
    );
}