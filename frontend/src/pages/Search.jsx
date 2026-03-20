import { useState } from 'react';
import { IconSearch } from '../components/icons.jsx';
import './Search.css';

export default function Search() {
  const [query, setQuery] = useState('');

  return (
    <div className="page-search">
      <div className="page-header">
        <h1 className="page-title">Recherche</h1>
      </div>

      <div className="search-input-wrapper">
        <span className="search-icon"><IconSearch /></span>
        <input
          className="search-input"
          type="search"
          placeholder="Rechercher une application…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      {/* Placeholder — Sprint 4 */}
      <div className="page-placeholder">
        <p>Résultats de recherche — Sprint 4</p>
      </div>
    </div>
  );
}
