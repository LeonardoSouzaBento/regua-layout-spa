import React from 'react';
import { Search, Lock, Unlock, LayoutGrid, Component } from 'lucide-react';

export type SelectedRuler = 'layout' | 'component' | null;

interface HeaderProps {
  selectedRuler: SelectedRuler;
  onSelectRuler: (ruler: 'layout' | 'component') => void;
  urlInput: string;
  setUrlInput: (value: string) => void;
  onSubmitUrl: (url: string) => void;
  onSaveToLocalStorage: () => void;
  isCurrentUrlSaved: boolean;
}

export function Header({
  selectedRuler,
  onSelectRuler,
  urlInput,
  setUrlInput,
  onSubmitUrl,
  onSaveToLocalStorage,
  isCurrentUrlSaved,
}: HeaderProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmitUrl(urlInput);
    }
  };

  return (
    <header className="header-container">
      <div className="ruler-buttons-group">
        <button
          className={`btn-ruler-icon ${selectedRuler === 'layout' ? 'active' : ''}`}
          onClick={() => onSelectRuler('layout')}
          aria-pressed={selectedRuler === 'layout'}
          aria-label="Régua de Layout"
          title="Régua de Layout"
        >
          <LayoutGrid size={20} />
        </button>
        <button
          className={`btn-ruler-icon ${selectedRuler === 'component' ? 'active' : ''}`}
          onClick={() => onSelectRuler('component')}
          aria-pressed={selectedRuler === 'component'}
          aria-label="Régua de Componentes"
          title="Régua de Componentes"
        >
          <Component size={20} />
        </button>
      </div>

      <div className="search-bar-container">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon-left" />
          <input
            type="text"
            className="search-input"
            placeholder="Digite uma URL e pressione Enter"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="URL"
          />
          <button
            className={`btn-lock ${isCurrentUrlSaved ? 'saved' : ''}`}
            onClick={onSaveToLocalStorage}
            aria-label={isCurrentUrlSaved ? 'Link salvo' : 'Salvar link'}
            title={isCurrentUrlSaved ? 'Link salvo no Local Storage' : 'Salvar link no Local Storage'}
          >
            {isCurrentUrlSaved ? <Lock size={16} /> : <Unlock size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
