export default function Menu() {
  return (
    <main style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '2rem', textAlign: 'center' }}>
        Projetos Bauhaus
      </h1>
      
      <div style={{ 
        display: 'flex', 
        gap: '2rem',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <a 
          href="/" 
          style={{
            display: 'block',
            padding: '1.5rem 2rem',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            textDecoration: 'none',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            minWidth: '200px',
            textAlign: 'center'
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)'
            e.target.style.transform = 'translateY(-2px)'
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.1)'
            e.target.style.transform = 'translateY(0)'
          }}
        >
          <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>Projeto 1</h2>
          <p style={{ margin: 0, opacity: 0.8 }}>
            Gerador de Pôsteres Bauhaus
          </p>
        </a>
        
        <a 
          href="/2" 
          style={{
            display: 'block',
            padding: '1.5rem 2rem',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            textDecoration: 'none',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            minWidth: '200px',
            textAlign: 'center'
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)'
            e.target.style.transform = 'translateY(-2px)'
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.1)'
            e.target.style.transform = 'translateY(0)'
          }}
        >
          <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>Projeto 2</h2>
          <p style={{ margin: 0, opacity: 0.8 }}>
            Gerador Bauhaus com rotações e múltiplas paletas
          </p>
        </a>
      </div>
      
      <p style={{ 
        marginTop: '3rem', 
        opacity: 0.7, 
        fontSize: '0.9rem',
        textAlign: 'center',
        maxWidth: '600px'
      }}>
        Coleção de geradores artísticos inspirados no movimento Bauhaus, 
        criados com p5.js e Next.js
      </p>
    </main>
  )
}
