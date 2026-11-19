import { useMemo, useState } from "react";
import { books, events } from "./data";
import "./styles.css";

const periods = ["Todos", ...new Set(events.map((event) => event.period))];

function BookPill({ book, onClick }) {
  return <button className="book-pill" onClick={() => onClick(book)}>{book.name}</button>;
}

export default function App() {
  const [query, setQuery] = useState("");
  const [period, setPeriod] = useState("Todos");
  const [testament, setTestament] = useState("Todos");
  const [selectedBook, setSelectedBook] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const filteredEvents = useMemo(() => events.filter((event) => {
    const text = `${event.title} ${event.summary} ${event.references} ${event.period}`.toLowerCase();
    const matchesQuery = text.includes(query.toLowerCase()) ||
      event.bookIds.some((id) => books.find((book) => book.id === id)?.name.toLowerCase().includes(query.toLowerCase()));
    const matchesPeriod = period === "Todos" || event.period === period;
    const matchesTestament = testament === "Todos" || event.bookIds.some((id) =>
      books.find((book) => book.id === id)?.testament === testament);
    return matchesQuery && matchesPeriod && matchesTestament;
  }), [query, period, testament]);

  const relatedBooks = selectedBook
    ? events.filter((event) => event.bookIds.includes(selectedBook.id))
    : [];

  return (
    <main>
      <nav className="top-nav" aria-label="Navegação principal">
        <h1>Lume da Palavra</h1>
      </nav>

      <header className="hero">
        <div className="hero-top"><span className="eyebrow">UM PANORAMA DAS ESCRITURAS</span><span className="count">66 LIVROS · 1 NARRATIVA</span></div>
        <h1>A história bíblica,<br/><em>do princípio à eternidade.</em></h1>
        <p>Explore os acontecimentos em ordem cronológica, conectando cada período aos livros que registram sua história.</p>
        <div className="hero-stats"><div><strong>66</strong><span>livros</span></div><div><strong>{events.length}</strong><span>marcos narrativos</span></div><div><strong>2</strong><span>testamentos</span></div></div>
      </header>

      <section className="controls" aria-label="Filtros da linha do tempo">
        <label className="search"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar evento, personagem, livro ou referência..." /></label>
        <div className="filters">
          <select value={period} onChange={(e) => setPeriod(e.target.value)} aria-label="Filtrar por período">
            {periods.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select value={testament} onChange={(e) => setTestament(e.target.value)} aria-label="Filtrar por testamento">
            <option>Todos</option><option value="AT">Antigo Testamento</option><option value="NT">Novo Testamento</option>
          </select>
          <button className="clear" onClick={() => {setQuery("");setPeriod("Todos");setTestament("Todos");}}>Limpar filtros</button>
        </div>
      </section>

      <section className="timeline-section">
        <div className="section-heading"><div><span className="eyebrow">PERCURSO CRONOLÓGICO</span><h2>Da criação à nova criação</h2></div><span className="result-count">{filteredEvents.length} acontecimentos</span></div>
        <div className="timeline-scroll">
          <div className="timeline-track">
            {filteredEvents.map((event, index) => (
              <article className={`event-card ${expanded === event.id ? "expanded" : ""}`} key={event.id}>
                <div className="track-node"><span>{String(index + 1).padStart(2, "0")}</span></div>
                <div className="event-period">{event.period}</div>
                <button className="event-body" onClick={() => setExpanded(expanded === event.id ? null : event.id)} aria-expanded={expanded === event.id}>
                  <span className="event-date">{event.dateLabel}</span>
                  <h3>{event.title}</h3>
                  <p>{event.summary}</p>
                  <span className="reference">{event.references}</span>
                  <span className="expand-label">{expanded === event.id ? "Recolher detalhes −" : "Ver detalhes +"}</span>
                  {expanded === event.id && <div className="event-details"><strong>Livros relacionados</strong><div className="book-pills">{event.bookIds.map((id) => {
                    const book = books.find((item) => item.id === id);
                    return book ? <BookPill key={id} book={book} onClick={setSelectedBook}/> : null;
                  })}</div></div>}
                </button>
              </article>
            ))}
            {filteredEvents.length === 0 && <div className="empty">Nenhum acontecimento encontrado. Tente outra busca ou limpe os filtros.</div>}
          </div>
        </div>
        <p className="scroll-hint">← Deslize horizontalmente para percorrer a história →</p>
      </section>

      <section className="library">
        <div className="section-heading"><div><span className="eyebrow">BIBLIOTECA BÍBLICA</span><h2>Os 66 livros</h2></div><span className="result-count">39 AT · 27 NT</span></div>
        <div className="testament-grid">
          {["AT","NT"].map((test) => <div className="testament-column" key={test}>
            <h3>{test === "AT" ? "Antigo Testamento" : "Novo Testamento"} <span>{books.filter((b) => b.testament === test).length}</span></h3>
            <div className="book-grid">{books.filter((book) => book.testament === test).map((book) =>
              <button className={`book-card ${selectedBook?.id === book.id ? "selected" : ""}`} key={book.id} onClick={() => setSelectedBook(book)}>
                <span className="book-period">{book.period}</span><strong>{book.name}</strong><small>{book.summary}</small>
              </button>
            )}</div>
          </div>)}
        </div>
      </section>

      {selectedBook && <div className="modal-backdrop" role="presentation" onClick={() => setSelectedBook(null)}>
        <section className="book-modal" role="dialog" aria-modal="true" aria-label={`Detalhes de ${selectedBook.name}`} onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={() => setSelectedBook(null)} aria-label="Fechar">×</button>
          <span className="eyebrow">{selectedBook.testament === "AT" ? "ANTIGO TESTAMENTO" : "NOVO TESTAMENTO"} · {selectedBook.period}</span>
          <h2>{selectedBook.name}</h2><p>{selectedBook.summary}</p>
          <h3>Onde aparece na linha do tempo</h3>
          {relatedBooks.length ? <ul className="related-list">{relatedBooks.map((event) => <li key={event.id}><strong>{event.title}</strong><span>{event.dateLabel} · {event.references}</span></li>)}</ul> : <p>Este livro ainda não está ligado a um marco narrativo específico. Consulte a classificação cronológica na estrutura de dados.</p>}
        </section>
      </div>}

      <footer><span>BÍBLIA EM LINHA DO TEMPO</span><p>Material de estudo e navegação bíblica. Datas e ordenações são aproximadas quando a própria Bíblia ou a pesquisa histórica não permitem precisão.</p></footer>
    </main>
  );
}
