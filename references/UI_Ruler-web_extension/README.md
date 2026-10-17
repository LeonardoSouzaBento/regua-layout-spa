# UI Ruler - web extension

Extensão de navegador usada para medir espaçamentos entre elementos de sites (veja as imagens abaixo).

<div style="display: flex; max-width: max-content; flex-wrap: wrap;">
  <img src="./src/assets/example.png" width="370" />
  <img src="./src/assets/example2.png" width="370" style="margin-left: 12px;" />
</div>

## Baixar a extensão

### Pré-requisitos

- Node.js (v18 ou superior)
- npm (ou yarn/pnpm)

### No terminal do seu computador:

1. Clone o repositório e navegue até a pasta do projeto:

   ```bash
   git clone https://github.com/LeonardoSouzaBento/UI_Ruler-web_extension
   cd UI_Ruler-web_extension
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Execute o build:
   ```bash
   npm run build
   ```

## Instalação da extensão no navegador

1 - Abra o seu navegador (Brave, Chrome ou Edge).

2 - Vá para a página de extensões digitando na barra de endereço: chrome://extensions

3 - Ative o Modo do desenvolvedor (chave seletora no canto superior direito).

4 - Clique no botão Carregar sem compactação (ou Load unpacked).

5 - Na janela que abrir, navegue até a pasta do seu projeto, entre em .output e selecione a pasta chrome-mv3.


### Por que essa extensão é útil?

Essa extensão é especialmente útil para desenvolvedores medirem espaçamentos entre textos e outros elementos, visto que textos não têm base ou topo bem definidos, nem mesmo com line-height=1. Além disso, outro uso pode ser para a criação de outras extensões, reaproveitando o modelo do projeto.

## Tecnologias Utilizadas

Este projeto foi desenvolvido com as seguintes tecnologias:

- **[React](https://react.dev/)**
- **[TypeScript](https://www.typescriptlang.org/)**
- **[Vite](https://vitejs.dev/)**
- **[vite-plugin-web-extension](https://vite-plugin-web-extension.aklinker1.io/)**
- **[Lucide React](https://lucide.dev/)**
- **[ESLint](https://eslint.org/)**

## License

[MIT](LICENSE)