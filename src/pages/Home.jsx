import Card from '../components/Card/Card.jsx';
import TestingBanner from '../components/Banner/Banner.jsx';
import Banner from '../components/Banner/Banner.jsx';
import styles from './Home.module.css';

export default function Home() {
    return (
        <>
        <TestingBanner />

        <div className={styles.section}>
            <div className={styles.sectionHeader}>
                <span className={styles.headerLine}></span>
                <span className={styles.headerLabel}>Filmes em Destaque</span>
            </div>

            <div className={styles.grid}>
                <Card
                    imagem="/scarface.png"
                    classificacao="18"
                    titulo="SCARFACE"
                    estrelas={5}
                    horario="19:00 - 22:30"
                />
                <Card
                    imagem="/interstellar.png"
                    classificacao="10"
                    titulo="INTERSTELLAR"
                    estrelas={5}
                    horario="19:00 - 21:30"
                />
                <Card
                    imagem="/fracos.png"
                    classificacao="16"
                    titulo="Onde os fracos não tem vez"
                    estrelas={5}
                    horario="17:00 - 19:50"
                />
                <Card
                    imagem="/poetas.png"
                    classificacao="12"
                    titulo="SOCIEDADE DOS POETAS MORTOS"
                    estrelas={5}
                    horario="14:00 - 16:00"
                />
                <Card
                    imagem="/clube-da-luta.png"
                    classificacao="18"
                    titulo="CLUBE DA LUTA"
                    estrelas={5}
                    horario="10:00 - 12:30"
                />
            </div>
        </div>
        </>
    );
}