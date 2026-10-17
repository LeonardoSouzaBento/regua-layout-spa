import "@/index.css";
import ReactDOM from "react-dom/client";
import Index from "@/pages/Index";

export default defineContentScript({
  matches: ["<all_urls>"],
  cssInjectionMode: "ui",

  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: "layout-column-ruler",
      position: "overlay",
      anchor: "body",
      append: "last",
      onMount: (container) => {
        const wrapper = document.createElement("div");
        wrapper.style.display = "none";
        wrapper.style.colorScheme = "light"; // Force light mode
        wrapper.style.zIndex = "999999";
        wrapper.style.fontSize = "16px";
        wrapper.className = "light"; // Useful if Tailwind is configured for classes
        container.append(wrapper);

        const root = ReactDOM.createRoot(wrapper);
        root.render(<Index />);

        // Listen for messages to toggle grid
        const onMessage = (message: any) => {
          if (message.type === "toggle-grid") {
            wrapper.style.display =
              wrapper.style.display === "none" ? "block" : "none";
          }
        };
        browser.runtime.onMessage.addListener(onMessage);

        return { root, onMessage };
      },
      onRemove: (state) => {
        if (state) {
          state.root.unmount();
          browser.runtime.onMessage.removeListener(state.onMessage);
        }
      },
    });

    ui.mount();
  },
});
