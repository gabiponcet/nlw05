//FORMAS DE CONSUMIR UMA API 
//SPA: SÓ CARREGA QD A TELA É CARREGADA PELO USUÁRIO - MAS NÃO HÁ ATUALIZAÇÃO QD NÃ HÁ ACESSO 
//SSR: FUNÇÃO DEVE SER EXPORTADA PARA CONTORNAR OS PROBLEMAS DO SPA. Essa função é executada antes da página ser exibida e suas props são passadas para a página antes dela ser carregada
//SSG: assim q a pessoa acessa a página, uma versão estática desta é servida aos próximos usuarios q acessarem a pagina. evita recarregar dados do servidor a cada acesso, como ocorre no SPA
export default function Home(props) {
  return (
    <div>
      <h1>Index</h1>
      <p>{JSON.stringify(props.episodes)}</p>
    </div>
  )
}

export async function getStaticProps() {
  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json()

  return {
    props: {
      episodes: data,
    },
    revalidate: 60 * 60 * 8,//durante o dia, usando SSR, apenas 3 chamadas para a API serão feitas
  }
}