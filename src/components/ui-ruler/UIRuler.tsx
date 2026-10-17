import React, { useState, useRef } from 'react';
import { ChevronDown, Eye, EyeOff, Move, RotateCw, Hand, HandGrab } from 'lucide-react';

const NUMBER_FIELDS = [
  {
    key: 'lines' as const,
    label: 'Linhas',
    quick: [2, 4, 6, 8, 10],
    step: 2,
    min: 1,
    max: 50,
  },
  {
    key: 'gap' as const,
    label: 'Gap (px)',
    quick: [16, 24, 32, 40, 48],
    step: 4,
    min: 4,
    max: 120,
  },
  {
    key: 'opacity' as const,
    label: 'Opacidade',
    quick: [0.2, 0.4, 0.6, 0.8, 1],
    step: 0.05,
    min: 0.05,
    max: 1,
  },
];

const COLOR_OPTIONS = [
  { name: 'Azul', value: '#2563eb' },
  { name: 'Amarelo', value: '#eab308' },
  { name: 'Verde', value: '#16a34a' },
  { name: 'Roxo', value: '#7c3aed' },
  { name: 'Violeta', value: '#9333ea' },
  { name: 'Vermelho', value: '#d71212' },
  { name: 'Preto', value: '#000000' },
  { name: 'Ciano', value: '#06b6d4' },
];

export const UIRuler: React.FC = () => {
  const [showLines, setShowLines] = useState(true);
  const [lines, setLines] = useState(4);
  const [gap, setGap] = useState(24);
  const [opacity, setOpacity] = useState(0.45);
  const [color, setColor] = useState('#2563eb');
  const [rotate, setRotate] = useState(0);
  const [showConfig, setShowConfig] = useState(false);

  // Position of ruler lines container
  const linesContainerRef = useRef<HTMLDivElement>(null);
  const linesPosRef = useRef({ top: 120, left: 240 });
  const [isDraggingLines, setIsDraggingLines] = useState(false);

  // Floating config pill position (elevated initial position)
  const configContainerRef = useRef<HTMLDivElement>(null);
  const configPosRef = useRef({ bottom: 75, right: 24 });
  const [isDraggingConfig, setIsDraggingConfig] = useState(false);

  // Dragging ruler lines across the screen with pointer capture
  const handleLinesPointerDown = (e: React.PointerEvent<HTMLButtonElement | HTMLDivElement>) => {
    e.stopPropagation();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    setIsDraggingLines(true);
    document.body.classList.add('is-dragging-element');
  };

  const handleLinesPointerMove = (e: React.PointerEvent<HTMLButtonElement | HTMLDivElement>) => {
    if (!isDraggingLines || !linesContainerRef.current) return;

    const { movementX, movementY } = e;
    linesPosRef.current.left = Math.max(10, linesPosRef.current.left + movementX);
    linesPosRef.current.top = Math.max(10, linesPosRef.current.top + movementY);

    const moveBtn = linesContainerRef.current.querySelector('.btn-move-lines') as HTMLElement | null;

    if (rotate === 0) {
      linesContainerRef.current.style.top = `${linesPosRef.current.top}px`;
      if (moveBtn) {
        moveBtn.style.left = `${linesPosRef.current.left}px`;
      }
    } else {
      linesContainerRef.current.style.left = `${linesPosRef.current.left}px`;
      if (moveBtn) {
        moveBtn.style.top = `${linesPosRef.current.top}px`;
      }
    }
  };

  const handleLinesPointerUp = (e: React.PointerEvent<HTMLButtonElement | HTMLDivElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    setIsDraggingLines(false);
    document.body.classList.remove('is-dragging-element');
  };

  // Dragging config pill with pointer capture
  const handleConfigPointerDown = (e: React.PointerEvent<HTMLButtonElement | HTMLDivElement>) => {
    e.stopPropagation();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    setIsDraggingConfig(true);
    document.body.classList.add('is-dragging-element');
  };

  const handleConfigPointerMove = (e: React.PointerEvent<HTMLButtonElement | HTMLDivElement>) => {
    if (!isDraggingConfig || !configContainerRef.current) return;

    const { movementX, movementY } = e;
    configPosRef.current.bottom = Math.max(10, configPosRef.current.bottom - movementY);
    configPosRef.current.right = Math.max(10, configPosRef.current.right - movementX);

    configContainerRef.current.style.bottom = `${configPosRef.current.bottom}px`;
    configContainerRef.current.style.right = `${configPosRef.current.right}px`;
  };

  const handleConfigPointerUp = (e: React.PointerEvent<HTMLButtonElement | HTMLDivElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    setIsDraggingConfig(false);
    document.body.classList.remove('is-dragging-element');
  };

  const height = lines * gap - 0.625 * lines;

  return (
    <>
      {/* Repeating Linear Gradient Ruler Lines (Horizontal across full width or Vertical across full height) */}
      {showLines && (
        <div
          ref={linesContainerRef}
          style={{
            position: 'absolute',
            top: rotate === 0 ? `${linesPosRef.current.top}px` : 0,
            bottom: rotate === 90 ? 0 : undefined,
            left: rotate === 0 ? 0 : `${linesPosRef.current.left}px`,
            width: rotate === 0 ? '100%' : `${height}px`,
            height: rotate === 0 ? `${height}px` : '100%',
            minHeight: rotate === 90 ? '100%' : undefined,
            zIndex: 35,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundImage:
                rotate === 0
                  ? `repeating-linear-gradient(
                      to bottom,
                      ${color},
                      ${color} 1.25px,
                      transparent 1px,
                      transparent ${gap}px
                    )`
                  : `repeating-linear-gradient(
                      to right,
                      ${color},
                      ${color} 1.25px,
                      transparent 1px,
                      transparent ${gap}px
                    )`,
              opacity,
              borderBottom: rotate === 0 ? `1.5px solid ${color}` : 'none',
              borderRight: rotate === 90 ? `1.5px solid ${color}` : 'none',
              transition: 'opacity 0.2s ease',
            }}
          />

          {/* Draggable MoveLinesButton to reposition lines over any component */}
          <button
            className="btn-move-lines"
            onPointerDown={handleLinesPointerDown}
            onPointerMove={handleLinesPointerMove}
            onPointerUp={handleLinesPointerUp}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              top: rotate === 0 ? '50%' : `${linesPosRef.current.top}px`,
              left: rotate === 0 ? `${linesPosRef.current.left}px` : '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '2.75rem',
              height: '2.75rem',
              backgroundColor: isDraggingLines ? '#e0f2fe' : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(4px)',
              borderRadius: '1rem',
              border: `1.5px solid ${isDraggingLines ? '#0284c7' : '#cbd5e1'}`,
              boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
              cursor: isDraggingLines ? 'grabbing' : 'grab',
              color: isDraggingLines ? '#0284c7' : '#0f172a',
              userSelect: 'none',
              touchAction: 'none',
            }}
            title="Clique e arraste para posicionar a régua sobre qualquer elemento"
          >
            <Move size={20} color="#0284c7" />
          </button>
        </div>
      )}

      {/* Floating Config Pill (Exact UI from UI_Ruler-web_extension) */}
      <div
        ref={configContainerRef}
        className="floating-glass-pill"
        style={{
          bottom: `${configPosRef.current.bottom}px`,
          right: `${configPosRef.current.right}px`,
          width: showConfig ? '320px' : 'auto',
          maxWidth: 'calc(100vw - 32px)',
        }}
      >
        {/* Expanded Options */}
        {showConfig && (
          <div
            style={{
              padding: '1rem',
              borderBottom: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              borderTopLeftRadius: '1rem',
              borderTopRightRadius: '1rem',
            }}
          >
            {/* Number Fields: Linhas, Gap, Opacidade */}
            {NUMBER_FIELDS.map((field) => {
              const val =
                field.key === 'lines'
                  ? lines
                  : field.key === 'gap'
                  ? gap
                  : opacity;
              const setVal =
                field.key === 'lines'
                  ? setLines
                  : field.key === 'gap'
                  ? setGap
                  : setOpacity;

              return (
                <div key={field.key} style={{ marginBottom: '0.85rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.3rem',
                    }}
                  >
                    <label
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: '#64748b',
                        textTransform: 'uppercase',
                      }}
                    >
                      {field.label}
                    </label>
                    <input
                      type="number"
                      step={field.step}
                      min={field.min}
                      max={field.max}
                      value={val}
                      onChange={(e) => setVal(Number(e.target.value))}
                      style={{
                        width: '4rem',
                        height: '1.75rem',
                        padding: '0 0.4rem',
                        borderRadius: '0.375rem',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: '#0f172a',
                        textAlign: 'right',
                      }}
                    />
                  </div>

                  {/* Quick Select Buttons com largura reduzida e rounded-full */}
                  <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                    {field.quick.map((quickVal) => (
                      <button
                        key={quickVal}
                        onClick={() => setVal(quickVal)}
                        style={{
                          minWidth: '2.1rem',
                          height: '1.6rem',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '9999px',
                          border: `1px solid ${val === quickVal ? '#0284c7' : '#e2e8f0'}`,
                          backgroundColor: val === quickVal ? '#e0f2fe' : '#f8fafc',
                          color: val === quickVal ? '#0284c7' : '#475569',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {quickVal}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Colors Palette */}
            <div style={{ marginBottom: '1rem', paddingTop: '0.25rem', borderTop: '1px solid #f1f5f9' }}>
              <span
                style={{
                  display: 'block',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: '#64748b',
                  textTransform: 'uppercase',
                  marginBottom: '0.4rem',
                }}
              >
                Cor das Linhas
              </span>
              <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setColor(c.value)}
                    style={{
                      width: '1.35rem',
                      height: '1.35rem',
                      borderRadius: '9999px',
                      backgroundColor: c.value,
                      border: color === c.value ? '2px solid #0284c7' : '1px solid rgba(0,0,0,0.15)',
                      outline: color === c.value ? '2px solid #e0f2fe' : 'none',
                      cursor: 'pointer',
                      transform: color === c.value ? 'scale(1.15)' : 'none',
                    }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Rotate Button */}
            <button
              onClick={() => setRotate((prev) => (prev === 0 ? 90 : 0))}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                border: '1px solid #cbd5e1',
                backgroundColor: rotate === 90 ? '#e0f2fe' : '#f8fafc',
                color: rotate === 90 ? '#0284c7' : '#334155',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <RotateCw size={14} />
              <span>Rotacionar ({rotate === 0 ? 'Horizontal' : 'Vertical'})</span>
            </button>
          </div>
        )}

        {/* Pill Button Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.45rem 0.65rem 0.45rem 0.85rem',
            backgroundColor: '#ffffff',
            borderRadius: showConfig ? '0 0 1rem 1rem' : '1rem',
            gap: '0.4rem',
          }}
        >
          {/* Lado esquerdo: apenas o botão Configurar */}
          <button
            onClick={() => setShowConfig((v) => !v)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: 'none',
              border: 'none',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#0f172a',
              cursor: 'pointer',
              padding: 0,
              whiteSpace: 'nowrap',
            }}
          >
            <ChevronDown
              size={18}
              style={{
                transform: showConfig ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s ease',
                color: '#0284c7',
              }}
            />
            <span>Configurar</span>
          </button>

          {/* Lado direito: Botão ocultar/mostrar posicionado perto do botão mover */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginLeft: '0.4rem' }}>
            {/* Visibility toggle button (same 2rem size as hand drag button) */}
            <button
              onClick={() => setShowLines((v) => !v)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '2rem',
                height: '2rem',
                borderRadius: '9999px',
                border: '1px solid #e2e8f0',
                backgroundColor: showLines ? '#ffffff' : '#fee2e2',
                color: showLines ? '#64748b' : '#ef4444',
                cursor: 'pointer',
              }}
              title={showLines ? 'Ocultar linhas' : 'Mostrar linhas'}
            >
              {showLines ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>

            {/* Drag pill handle with Hand/HandGrab and pointer capture */}
            <button
              onPointerDown={handleConfigPointerDown}
              onPointerMove={handleConfigPointerMove}
              onPointerUp={handleConfigPointerUp}
              onClick={(e) => e.stopPropagation()}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '2rem',
                height: '2rem',
                borderRadius: '9999px',
                border: '1px solid #e2e8f0',
                backgroundColor: isDraggingConfig ? '#e0f2fe' : '#f8fafc',
                color: isDraggingConfig ? '#0284c7' : '#64748b',
                cursor: isDraggingConfig ? 'grabbing' : 'grab',
                touchAction: 'none',
              }}
              title="Clique e arraste para mover o painel de configuração"
            >
              {isDraggingConfig ? <HandGrab size={16} /> : <Hand size={16} />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
