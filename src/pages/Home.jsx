import Card from '../components/Card.jsx';

export default function Home() {
    return (
        <div>

            <h3 style={{paddingLeft: '50px', color: 'white', fontFamily: 'Montserrat, sans-serif', position: 'relative', top: '30px', fontSize: '17px'}}> -Filmes em Destaque</h3>
            <div style={{ padding: '40px', display: 'flex', gap: '20px' }}>
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
                    titulo="ONDE OS FRACOS NÃO TEM VEZ"
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
                    titulo="SOCIEDADE DOS POETAS MORTOS"
                    estrelas={5}
                    horario="10:00 - 12:30"
                />
            </div>

        </div>
    );
}