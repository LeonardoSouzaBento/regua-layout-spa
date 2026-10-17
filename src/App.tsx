import { useState } from 'react';
import './App.css';
import { Header, type SelectedRuler } from './components/Header';
import { SiteViewport } from './components/SiteViewport';
import { CheckCircle2 } from 'lucide-react';

const STORAGE_KEY_CURRENT_URL = 'regua_saved_url';
const STORAGE_KEY_URLS_LIST = 'regua_saved_urls';

export function App() {
  // Initialize URL from localStorage if available
  const [currentUrl, setCurrentUrl] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CURRENT_URL);
      return saved || 'https://pt.wikipedia.org';
    } catch {
      return 'https://pt.wikipedia.org';
    }
  });

  const [urlInput, setUrlInput] = useState<string>(() => currentUrl);

  const [savedUrls, setSavedUrls] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_URLS_LIST);
      if (stored) {
        return JSON.parse(stored);
      }
      return [currentUrl];
    } catch {
      return [currentUrl];
    }
  });

  // Mutually exclusive ruler selection: Régua de componentes selecionada por padrão
  const [selectedRuler, setSelectedRuler] = useState<SelectedRuler>('component');

  const handleSelectRuler = (ruler: 'layout' | 'component') => {
    setSelectedRuler((prev) => (prev === ruler ? null : ruler));
  };

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const sanitizeUrl = (raw: string) => {
    let trimmed = raw.trim();
    if (!trimmed) return '';
    if (!/^https?:\/\//i.test(trimmed)) {
      trimmed = `https://${trimmed}`;
    }
    return trimmed;
  };

  const handleSubmitUrl = (urlToLoad: string) => {
    const formatted = sanitizeUrl(urlToLoad);
    if (!formatted) return;
    setCurrentUrl(formatted);
    setUrlInput(formatted);
  };

  const handleSaveToLocalStorage = () => {
    const formatted = sanitizeUrl(urlInput);
    if (!formatted) {
      showToast('Por favor, digite um link válido primeiro.');
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY_CURRENT_URL, formatted);
      setSavedUrls((prev) => {
        const nextList = prev.includes(formatted) ? prev : [formatted, ...prev];
        localStorage.setItem(STORAGE_KEY_URLS_LIST, JSON.stringify(nextList));
        return nextList;
      });

      setCurrentUrl(formatted);
      showToast('Link salvo com sucesso no Local Storage!');
    } catch (e) {
      console.error(e);
      showToast('Erro ao salvar no Local Storage');
    }
  };

  const isCurrentUrlSaved = Boolean(
    urlInput && savedUrls.includes(sanitizeUrl(urlInput))
  );

  return (
    <div className="app-layout">
      {/* Header com botões de ícone (Régua Layout / Régua Componentes) + Barra de pesquisa com cadeado */}
      <Header
        selectedRuler={selectedRuler}
        onSelectRuler={handleSelectRuler}
        urlInput={urlInput}
        setUrlInput={setUrlInput}
        onSubmitUrl={handleSubmitUrl}
        onSaveToLocalStorage={handleSaveToLocalStorage}
        isCurrentUrlSaved={isCurrentUrlSaved}
      />

      {/* Área abaixo para visualização do site do link inserido com o componente da régua selecionada */}
      <SiteViewport
        currentUrl={currentUrl}
        selectedRuler={selectedRuler}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notice">
          <CheckCircle2 size={16} color="#38bdf8" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default App;
