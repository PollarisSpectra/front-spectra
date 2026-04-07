import Card from '../components/Card/Card.jsx';
// import Banner from "../components/Banner/Banner.jsx";
import TestingBanner from '../components/Banner/TestingBanner.jsx';

export default function Home() {
    return (
        <>
        {/* <Banner /> */}
        <TestingBanner />

        <div className="container d-flex flex-column my-5">
            <div className="d-flex align-items-center gap-2 mb-2">
                <span style={{width: 50, height: 3}} className="bg-white"></span>
                <span style={{color: 'white', fontFamily: 'Montserrat, sans-serif', position: 'relative', fontSize: '17px'}}>Filmes em Destaque</span>
            </div>

            <div className="d-flex gap-2 flex-wrap row">
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
                    titulo="SOCIEDADE DOS POETAS MORTOS"
                    estrelas={5}
                    horario="10:00 - 12:30"
                />
            </div>

        </div>
        </>
    );
}