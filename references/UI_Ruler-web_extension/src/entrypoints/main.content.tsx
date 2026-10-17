import "@/index.css";
import ReactDOM from "react-dom/client";
import Index from "@/pages/Index";

export default defineContentScript({
  matches: ["<all_urls>"],
  cssInjectionMode: "ui",

  async main(ctx) {
    console.log("UI Ruler: Content script loaded");

    let ui: any = null;
    let wrapper: HTMLDivElement | null = null;

    const initUi = async () => {
      ui = await createShadowRootUi(ctx, {
        name: "ui-ruler",
        position: "overlay",
        anchor: "body",
        append: "last",
        onMount: (container) => {
          wrapper = document.createElement("div");
          wrapper.style.display = "block"; // Open it when mounting
          wrapper.style.colorScheme = "light";
          wrapper.style.zIndex = "999999";
          wrapper.style.fontSize = "16px";
          wrapper.className = "light";
          container.append(wrapper);

          const root = ReactDOM.createRoot(wrapper);
          root.render(<Index />);

          const onDismount = () => {
            ui?.remove();
          };
          window.addEventListener("ui-ruler-dismount", onDismount);

          return { root, onDismount };
        },
        onRemove: (state) => {
          if (state) {
            state.root.unmount();
            window.removeEventListener("ui-ruler-dismount", state.onDismount);
          }
          ui = null;
          wrapper = null;
        },
      });
      ui.mount();
    };

    browser.runtime.onMessage.addListener((message) => {
      if (message.type === "toggle-grid") {
        if (!ui) {
          initUi();
        } else if (wrapper) {
          wrapper.style.display =
            wrapper.style.display === "none" ? "block" : "none";
        }
      }
    });
  },
});
