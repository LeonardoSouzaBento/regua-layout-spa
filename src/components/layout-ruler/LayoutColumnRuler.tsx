import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Hand, HandGrab, Eye, EyeOff, SlidersHorizontal } from 'lucide-react';
import { gridLayouts, type Device, type GridLayout } from './gridLayouts';

const COLORS = [
  { name: 'blue', value: '220 70% 55%' },
  { name: 'red', value: '0 72% 55%' },
  { name: 'green', value: '142 60% 45%' },
  { name: 'purple', value: '270 60% 55%' },
  { name: 'orange', value: '25 90% 55%' },
  { name: 'pink', value: '330 70% 55%' },
  { name: 'teal', value: '180 55% 45%' },
  { name: 'gray', value: '220 10% 50%' },
];

function detectDevice(): Device {
  if (typeof window === 'undefined') return 'desktop';
  if (window.matchMedia('(max-width: 768px)').matches) return 'mobile';
  if (window.matchMedia('(max-width: 1024px)').matches) return 'tablet';
  return 'desktop';
}

function getDefaultLayout(d: Device): GridLayout {
  const group = gridLayouts[d];
  return (
    group.layouts.find((l) => l.alias === 'default') ||
    group.layouts.find((l) => l.alias === 'compact') ||
    group.layouts[0]
  );
}

function parsePixels(val?: string): number {
  if (!val) return 0;
  return parseInt(val.replace('px', '').trim(), 10) || 0;
}

export const LayoutColumnRuler: React.FC = () => {
  // Device selection
  const [device, setDevice] = useState<Device>(detectDevice);

  // Active layout preset
  const [activePresetAlias, setActivePresetAlias] = useState<string>(() => getDefaultLayout(detectDevice()).alias);
  const [isCustomized, setIsCustomized] = useState<boolean>(false);

  // Grid values (editable inline)
  const [colsValue, setColsValue] = useState<number>(() => getDefaultLayout(detectDevice()).columns);
  const [gutterValue, setGutterValue] = useState<number>(() => parsePixels(getDefaultLayout(detectDevice()).gutter));
  const [marginValue, setMarginValue] = useState<number>(() => parsePixels(getDefaultLayout(detectDevice()).margin));
  const [gridType, setGridType] = useState<'stretch' | 'center'>(() => getDefaultLayout(detectDevice()).type);
  const [colWidth, setColWidth] = useState<string | undefined>(() => getDefaultLayout(detectDevice()).width);

  // Color & Opacity
  const [color, setColor] = useState('220 70% 55%');
  const [opacity, setOpacity] = useState(0.25);
  const [open, setOpen] = useState(false);
  const [showColumns, setShowColumns] = useState(true);
  const [isGrabbing, setIsGrabbing] = useState(false);

  // Quick options popover state for properties ('columns' | 'gutter' | 'margin' | null)
  const [activePropertyOptions, setActivePropertyOptions] = useState<'columns' | 'gutter' | 'margin' | null>(null);

  // Position for floating widget using direct ref for zero-latency movement
  const positionRef = useRef({ bottom: 75, right: 24 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-detect and sync device on screen resize (if not customized)
  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 768px)');
    const tabletQuery = window.matchMedia('(max-width: 1024px)');

    const handleMediaChange = () => {
      if (isCustomized) return;
      const detected = detectDevice();
      setDevice(detected);
      applyPreset(getDefaultLayout(detected));
    };

    mobileQuery.addEventListener('change', handleMediaChange);
    tabletQuery.addEventListener('change', handleMediaChange);

    return () => {
      mobileQuery.removeEventListener('change', handleMediaChange);
      tabletQuery.removeEventListener('change', handleMediaChange);
    };
  }, [isCustomized]);

  // Pointer capture drag logic
  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement | HTMLDivElement>) => {
    e.stopPropagation();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // fallback
    }
    setIsGrabbing(true);
    document.body.classList.add('is-dragging-element');
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement | HTMLDivElement>) => {
    if (!isGrabbing || !containerRef.current) return;

    const { movementX, movementY } = e;

    positionRef.current.bottom = Math.max(10, positionRef.current.bottom - movementY);
    positionRef.current.right = Math.max(10, positionRef.current.right - movementX);

    containerRef.current.style.bottom = `${positionRef.current.bottom}px`;
    containerRef.current.style.right = `${positionRef.current.right}px`;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement | HTMLDivElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    setIsGrabbing(false);
    document.body.classList.remove('is-dragging-element');
  };

  const applyPreset = (preset: GridLayout) => {
    setIsCustomized(false);
    setActivePresetAlias(preset.alias);
    setColsValue(preset.columns);
    setGutterValue(parsePixels(preset.gutter));
    setMarginValue(parsePixels(preset.margin));
    setGridType(preset.type);
    setColWidth(preset.width);
    setActivePropertyOptions(null);
  };

  const handleDeviceChange = (newDevice: Device) => {
    setDevice(newDevice);
    applyPreset(getDefaultLayout(newDevice));
  };

  // Handlers for modifying values inline (sets 'personalizado' as active)
  const handleUpdateCols = (num: number) => {
    setColsValue(Math.max(1, num));
    setIsCustomized(true);
  };

  const handleUpdateGutter = (num: number) => {
    setGutterValue(Math.max(0, num));
    setIsCustomized(true);
  };

  const handleUpdateMargin = (num: number) => {
    setMarginValue(Math.max(0, num));
    setIsCustomized(true);
  };

  const togglePropertyOptions = (prop: 'columns' | 'gutter' | 'margin') => {
    setActivePropertyOptions((prev) => (prev === prop ? null : prop));
  };

  // Grid container style
  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 25,
    display: 'grid',
    gap: `${gutterValue}px`,
    ...(gridType === 'stretch'
      ? {
          gridTemplateColumns: `repeat(${colsValue}, 1fr)`,
          padding: `0 ${marginValue}px`,
        }
      : {
          gridTemplateColumns: `repeat(${colsValue}, ${colWidth || '80px'})`,
          justifyContent: 'center',
        }),
  };

  return (
    <>
      {/* Visual Columns Overlay */}
      {showColumns && (
        <div style={containerStyle}>
          {Array.from({ length: colsValue }, (_, i) => (
            <div
              key={i}
              style={{
                height: '100%',
                background: `hsl(${color} / ${opacity})`,
              }}
            />
          ))}
        </div>
      )}

      {/* Floating Config Widget */}
      <div
        ref={containerRef}
        className="floating-glass-pill"
        style={{
          bottom: `${positionRef.current.bottom}px`,
          right: `${positionRef.current.right}px`,
          zIndex: 45,
          width: open ? '360px' : 'auto',
          maxWidth: 'calc(100vw - 32px)',
        }}
      >
        {/* Expanded Panel */}
        {open && (
          <div
            style={{
              padding: '1rem',
              borderBottom: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              borderTopLeftRadius: '1rem',
              borderTopRightRadius: '1rem',
              maxHeight: '75vh',
              overflowY: 'auto',
            }}
          >
            {/* Device tabs com rolagem horizontal na ordem: mobile, tablet, desktop, frameworks */}
            <div
              style={{
                display: 'flex',
                overflowX: 'auto',
                flexWrap: 'nowrap',
                gap: '0.35rem',
                marginBottom: '0.75rem',
                paddingBottom: '0.35rem',
                paddingTop: '0.1rem',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {(['mobile', 'tablet', 'desktop', 'frameworks'] as const).map((d) => {
                const group = gridLayouts[d];
                const Icon = group.icon;
                const isSelected = device === d;
                return (
                  <button
                    key={d}
                    onClick={() => handleDeviceChange(d)}
                    style={{
                      flexShrink: 0,
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                      padding: '0.4rem 0.75rem',
                      borderRadius: '0.5rem',
                      border: `1px solid ${isSelected ? '#0284c7' : '#e2e8f0'}`,
                      backgroundColor: isSelected ? '#0284c7' : '#f8fafc',
                      color: isSelected ? '#ffffff' : '#475569',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <Icon size={14} />
                    <span>{group.label}</span>
                  </button>
                );
              })}
            </div>


            {/* Box com os 3 atributos do grid: Colunas, Gutter, Margem com edição direta e botão de opções predefinidas */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                padding: '0.45rem 0.5rem',
                borderRadius: '0.65rem',
                border: 'none',
                marginBottom: '0.75rem',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '0.5rem',
                }}
              >
                {/* 1. Atributo: Colunas */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <span style={{ color: '#64748b', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    Colunas
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <input
                      type="number"
                      min={1}
                      max={32}
                      value={colsValue}
                      onChange={(e) => handleUpdateCols(Number(e.target.value))}
                      style={{
                        width: '100%',
                        height: '1.85rem',
                        padding: '0 0.35rem',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        color: '#0f172a',
                        backgroundColor: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '0.375rem',
                        outline: 'none',
                        textAlign: 'center',
                      }}
                      title="Clique para editar o número de colunas"
                    />
                    {/* Botão ao lado para abrir opções predefinidas de Colunas */}
                    <button
                      onClick={() => togglePropertyOptions('columns')}
                      style={{
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '1.65rem',
                        height: '1.85rem',
                        borderRadius: '0.375rem',
                        border: `1px solid ${activePropertyOptions === 'columns' ? '#0284c7' : '#cbd5e1'}`,
                        backgroundColor: activePropertyOptions === 'columns' ? '#e0f2fe' : '#ffffff',
                        color: activePropertyOptions === 'columns' ? '#0284c7' : '#64748b',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                      title="Ver opções predefinidas de colunas"
                    >
                      <ChevronDown
                        size={13}
                        style={{
                          transform: activePropertyOptions === 'columns' ? 'rotate(180deg)' : 'none',
                          transition: 'transform 0.15s ease',
                        }}
                      />
                    </button>
                  </div>
                </div>

                {/* 2. Atributo: Gutter */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <span style={{ color: '#64748b', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    Gutter
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <div style={{ position: 'relative', width: '100%' }}>
                      <input
                        type="number"
                        min={0}
                        max={120}
                        value={gutterValue}
                        onChange={(e) => handleUpdateGutter(Number(e.target.value))}
                        style={{
                          width: '100%',
                          height: '1.85rem',
                          padding: '0 1.15rem 0 0.35rem',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          color: '#0f172a',
                          backgroundColor: '#ffffff',
                          border: '1px solid #cbd5e1',
                          borderRadius: '0.375rem',
                          outline: 'none',
                          textAlign: 'center',
                        }}
                        title="Clique para editar a calha (gutter)"
                      />
                      <span
                        style={{
                          position: 'absolute',
                          right: '0.25rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          fontSize: '0.65rem',
                          color: '#94a3b8',
                          pointerEvents: 'none',
                          fontWeight: 600,
                        }}
                      >
                        px
                      </span>
                    </div>
                    {/* Botão ao lado para abrir opções predefinidas de Gutter */}
                    <button
                      onClick={() => togglePropertyOptions('gutter')}
                      style={{
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '1.65rem',
                        height: '1.85rem',
                        borderRadius: '0.375rem',
                        border: `1px solid ${activePropertyOptions === 'gutter' ? '#0284c7' : '#cbd5e1'}`,
                        backgroundColor: activePropertyOptions === 'gutter' ? '#e0f2fe' : '#ffffff',
                        color: activePropertyOptions === 'gutter' ? '#0284c7' : '#64748b',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                      title="Ver opções predefinidas de gutter"
                    >
                      <ChevronDown
                        size={13}
                        style={{
                          transform: activePropertyOptions === 'gutter' ? 'rotate(180deg)' : 'none',
                          transition: 'transform 0.15s ease',
                        }}
                      />
                    </button>
                  </div>
                </div>

                {/* 3. Atributo: Margem */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <span style={{ color: '#64748b', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    Margem
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <div style={{ position: 'relative', width: '100%' }}>
                      <input
                        type="number"
                        min={0}
                        max={300}
                        value={marginValue}
                        onChange={(e) => handleUpdateMargin(Number(e.target.value))}
                        style={{
                          width: '100%',
                          height: '1.85rem',
                          padding: '0 1.15rem 0 0.35rem',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          color: '#0f172a',
                          backgroundColor: '#ffffff',
                          border: '1px solid #cbd5e1',
                          borderRadius: '0.375rem',
                          outline: 'none',
                          textAlign: 'center',
                        }}
                        title="Clique para editar a margem lateral"
                      />
                      <span
                        style={{
                          position: 'absolute',
                          right: '0.25rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          fontSize: '0.65rem',
                          color: '#94a3b8',
                          pointerEvents: 'none',
                          fontWeight: 600,
                        }}
                      >
                        px
                      </span>
                    </div>
                    {/* Botão ao lado para abrir opções predefinidas de Margem */}
                    <button
                      onClick={() => togglePropertyOptions('margin')}
                      style={{
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '1.65rem',
                        height: '1.85rem',
                        borderRadius: '0.375rem',
                        border: `1px solid ${activePropertyOptions === 'margin' ? '#0284c7' : '#cbd5e1'}`,
                        backgroundColor: activePropertyOptions === 'margin' ? '#e0f2fe' : '#ffffff',
                        color: activePropertyOptions === 'margin' ? '#0284c7' : '#64748b',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                      title="Ver opções predefinidas de margem"
                    >
                      <ChevronDown
                        size={13}
                        style={{
                          transform: activePropertyOptions === 'margin' ? 'rotate(180deg)' : 'none',
                          transition: 'transform 0.15s ease',
                        }}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Opções Predefinidas da Propriedade Selecionada */}
              {activePropertyOptions && (
                <div
                  style={{
                    marginTop: '0.65rem',
                    paddingTop: '0.5rem',
                    borderTop: '1px dashed #cbd5e1',
                  }}
                >
                  <span
                    style={{
                      display: 'block',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      color: '#0284c7',
                      textTransform: 'uppercase',
                      marginBottom: '0.35rem',
                    }}
                  >
                    Opções Rápidas de {activePropertyOptions === 'columns' ? 'Colunas' : activePropertyOptions === 'gutter' ? 'Gutter' : 'Margem'}:
                  </span>

                  {/* Predefinições de Colunas */}
                  {activePropertyOptions === 'columns' && (
                    <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                      {[3, 4, 6, 8, 12, 16].map((num) => (
                        <button
                          key={num}
                          onClick={() => {
                            handleUpdateCols(num);
                            setActivePropertyOptions(null);
                          }}
                          style={{
                            padding: '0.2rem 0.55rem',
                            borderRadius: '0.25rem',
                            border: `1px solid ${colsValue === num ? '#0284c7' : '#cbd5e1'}`,
                            backgroundColor: colsValue === num ? '#e0f2fe' : '#ffffff',
                            color: colsValue === num ? '#0284c7' : '#334155',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Predefinições de Gutter */}
                  {activePropertyOptions === 'gutter' && (
                    <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                      {[8, 12, 16, 20, 24, 32].map((g) => (
                        <button
                          key={g}
                          onClick={() => {
                            handleUpdateGutter(g);
                            setActivePropertyOptions(null);
                          }}
                          style={{
                            padding: '0.2rem 0.55rem',
                            borderRadius: '0.25rem',
                            border: `1px solid ${gutterValue === g ? '#0284c7' : '#cbd5e1'}`,
                            backgroundColor: gutterValue === g ? '#e0f2fe' : '#ffffff',
                            color: gutterValue === g ? '#0284c7' : '#334155',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          {g}px
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Predefinições de Margem */}
                  {activePropertyOptions === 'margin' && (
                    <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                      {[0, 12, 16, 24, 32, 64, 100].map((m) => (
                        <button
                          key={m}
                          onClick={() => {
                            handleUpdateMargin(m);
                            setActivePropertyOptions(null);
                          }}
                          style={{
                            padding: '0.2rem 0.55rem',
                            borderRadius: '0.25rem',
                            border: `1px solid ${marginValue === m ? '#0284c7' : '#cbd5e1'}`,
                            backgroundColor: marginValue === m ? '#e0f2fe' : '#ffffff',
                            color: marginValue === m ? '#0284c7' : '#334155',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          {m}px
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Segmented control: Esticar vs Centralizar com fundo cinza sem contorno e contorno azul claro na opção selecionada (sem rounded-full) */}
              <div
                style={{
                  marginTop: '0.5rem',
                  display: 'flex',
                  backgroundColor: '#f1f5f9',
                  borderRadius: '0.5rem',
                  padding: '0.2rem',
                  gap: '0.25rem',
                  border: 'none',
                  outline: 'none',
                }}
              >
                {/* Opção Esticar */}
                <button
                  type="button"
                  onClick={() => {
                    setGridType('stretch');
                    setIsCustomized(true);
                  }}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.3rem 0.5rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    backgroundColor: gridType === 'stretch' ? '#ffffff' : 'transparent',
                    border: gridType === 'stretch' ? '1px solid #bae6fd' : '1px solid transparent',
                    color: gridType === 'stretch' ? '#0284c7' : '#64748b',
                    boxShadow: gridType === 'stretch' ? '0 1px 2px rgba(0, 0, 0, 0.05)' : 'none',
                  }}
                >
                  Esticar
                </button>

                {/* Opção Centralizar */}
                <button
                  type="button"
                  onClick={() => {
                    setGridType('center');
                    setIsCustomized(true);
                  }}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.3rem 0.5rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    backgroundColor: gridType === 'center' ? '#ffffff' : 'transparent',
                    border: gridType === 'center' ? '1px solid #bae6fd' : '1px solid transparent',
                    color: gridType === 'center' ? '#0284c7' : '#64748b',
                    boxShadow: gridType === 'center' ? '0 1px 2px rgba(0, 0, 0, 0.05)' : 'none',
                  }}
                >
                  Centralizar
                </button>
              </div>
            </div>

            {/* Card Pré-definições logo acima da seção cor das colunas, com rolagem horizontal e chip 'personalizado' */}
            <div style={{ marginBottom: '0.85rem' }}>
              <span
                style={{
                  display: 'block',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#64748b',
                  textTransform: 'uppercase',
                  marginBottom: '0.4rem',
                }}
              >
                Pré-definições ({gridLayouts[device].layouts.length + (isCustomized ? 1 : 0)})
              </span>
              <div
                style={{
                  display: 'flex',
                  overflowX: 'auto',
                  flexWrap: 'nowrap',
                  gap: '0.45rem',
                  paddingBottom: '0.35rem',
                  paddingTop: '0.1rem',
                  WebkitOverflowScrolling: 'touch',
                }}
              >
                {/* Chip 'personalizado' selecionado que aparece quando o usuário edita um atributo */}
                {isCustomized && (
                  <button
                    style={{
                      flexShrink: 0,
                      whiteSpace: 'nowrap',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '9999px',
                      border: '1px solid #0284c7',
                      backgroundColor: '#0284c7',
                      color: '#ffffff',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'default',
                      boxShadow: '0 1px 3px rgba(2, 132, 199, 0.25)',
                    }}
                    title="Configuração personalizada manualmente"
                  >
                    personalizado
                  </button>
                )}

                {/* Lista de pré-definições do dispositivo */}
                {gridLayouts[device].layouts.map((l) => {
                  const isChosen = !isCustomized && activePresetAlias === l.alias;
                  return (
                    <button
                      key={l.alias}
                      onClick={() => applyPreset(l)}
                      title={l.description || l.alias}
                      style={{
                        flexShrink: 0,
                        whiteSpace: 'nowrap',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '9999px',
                        border: `1px solid ${isChosen ? '#0284c7' : '#cbd5e1'}`,
                        backgroundColor: isChosen ? '#0284c7' : '#f8fafc',
                        color: isChosen ? '#ffffff' : '#334155',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {l.alias}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Controls */}
            <div style={{ marginBottom: '0.75rem' }}>
              <span
                style={{
                  display: 'block',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  color: '#64748b',
                  textTransform: 'uppercase',
                  marginBottom: '0.35rem',
                }}
              >
                Cor das Colunas
              </span>
              <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                {COLORS.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setColor(c.value)}
                    style={{
                      width: '1.25rem',
                      height: '1.25rem',
                      borderRadius: '9999px',
                      background: `hsl(${c.value})`,
                      border: color === c.value ? '2px solid #0284c7' : '1px solid rgba(0,0,0,0.1)',
                      outline: color === c.value ? '2px solid #e0f2fe' : 'none',
                      cursor: 'pointer',
                      transform: color === c.value ? 'scale(1.15)' : 'none',
                    }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Opacity Slider */}
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  color: '#64748b',
                  textTransform: 'uppercase',
                  marginBottom: '0.3rem',
                }}
              >
                <span>Opacidade</span>
                <span style={{ color: '#0f172a' }}>{Math.round(opacity * 100)}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={90}
                value={Math.round(opacity * 100)}
                onChange={(e) => setOpacity(Number(e.target.value) / 100)}
                style={{ width: '100%', accentColor: '#0284c7', cursor: 'pointer' }}
              />
            </div>
          </div>
        )}

        {/* Pill Bar Button (Configurar grid + Ocultar/Mostrar + Drag handle) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.45rem 0.65rem 0.45rem 0.85rem',
            backgroundColor: '#ffffff',
            borderRadius: open ? '0 0 1rem 1rem' : '1rem',
            gap: '0.4rem',
          }}
        >
          <button
            onClick={() => setOpen((v) => !v)}
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
                transform: open ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s ease',
                color: '#0284c7',
              }}
            />
            <span>Configurar grid</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginLeft: '0.4rem' }}>
            {/* Botão de ocultar/mostrar colunas (tamanho 2rem x 2rem circular) */}
            <button
              onClick={() => setShowColumns((v) => !v)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '2rem',
                height: '2rem',
                borderRadius: '9999px',
                border: '1px solid #e2e8f0',
                backgroundColor: showColumns ? '#ffffff' : '#fee2e2',
                color: showColumns ? '#64748b' : '#ef4444',
                cursor: 'pointer',
              }}
              title={showColumns ? 'Ocultar colunas do layout' : 'Mostrar colunas do layout'}
            >
              {showColumns ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>

            {/* Drag Handle Button (mesmo tamanho 2rem x 2rem circular) */}
            <button
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onClick={(e) => e.stopPropagation()}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '2rem',
                height: '2rem',
                borderRadius: '9999px',
                border: '1px solid #e2e8f0',
                backgroundColor: isGrabbing ? '#e0f2fe' : '#f8fafc',
                color: isGrabbing ? '#0284c7' : '#64748b',
                cursor: isGrabbing ? 'grabbing' : 'grab',
                touchAction: 'none',
              }}
              title="Clique e arraste para mover o painel pela tela"
            >
              {isGrabbing ? <HandGrab size={16} /> : <Hand size={16} />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
