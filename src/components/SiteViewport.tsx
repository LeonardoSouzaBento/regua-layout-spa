import React from 'react';
import { LayoutColumnRuler } from './layout-ruler/LayoutColumnRuler';
import { UIRuler } from './ui-ruler/UIRuler';
import type { SelectedRuler } from './Header';

interface SiteViewportProps {
  currentUrl: string;
  selectedRuler: SelectedRuler;
}

export const SiteViewport: React.FC<SiteViewportProps> = ({
  currentUrl,
  selectedRuler,
}) => {
  return (
    <main className="viewport-area">
      {/* Visualização direta do site do link inserido, sem barras intermediárias */}
      {currentUrl ? (
        <iframe
          src={currentUrl}
          title="Visualização do site inserido"
          className="site-frame"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: '#94a3b8',
            fontSize: '0.9rem',
          }}
        >
          Nenhum link inserido. Digite um link na barra de pesquisa acima.
        </div>
      )}

      {/* Régua de Layout (Layout_Column_Ruler-web_extension) */}
      {selectedRuler === 'layout' && <LayoutColumnRuler />}

      {/* Régua de Componentes (UI_Ruler-web_extension) */}
      {selectedRuler === 'component' && <UIRuler />}
    </main>
  );
};
