# Bíblia em Linha do Tempo

Aplicação React + Vite com linha do tempo horizontal, filtros e catálogo dos 66 livros.

## Executar localmente

Requer Node.js 18+.

```bash
npm install
npm run dev
```

Para gerar a versão de produção:

```bash
npm run build
npm run preview
```

## Estrutura

- `src/data.js`: catálogo dos 66 livros e acontecimentos cronológicos.
- `src/App.jsx`: interface, filtros, cartões expansíveis e detalhes dos livros.
- `src/styles.css`: identidade visual responsiva.
- `src/main.jsx`: ponto de entrada React.

## Modelo dos dados

Cada livro possui `id`, `name`, `testament`, `period` e `summary`.

Cada acontecimento possui `id`, `title`, `summary`, `references`, `bookIds`, `period` e `dateLabel`. `bookIds` conecta o evento aos livros relacionados. Para acrescentar um acontecimento, basta incluí-lo no array `events` em `src/data.js` e usar IDs de livros existentes.

## Nota editorial

A cronologia bíblica contém datas e ordenações debatidas. Os rótulos temporais são aproximados e evitam apresentar como consenso o que é objeto de diferentes interpretações. Alguns livros poéticos e proféticos abrangem períodos ou têm datação incerta; por isso aparecem associados a contextos amplos. Os eventos são marcos narrativos resumidos, não uma afirmação de que todos os episódios de cada capítulo foram individualizados.
