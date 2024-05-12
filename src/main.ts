import { createSSRApp } from "vue";
import App from "./App.vue";
import uviewPlus from "uview-plus";
import { createPinia } from "pinia";

export function createApp() {
  const app = createSSRApp(App);
  const pinia = createPinia();
  app.use(uviewPlus);
  app.use(pinia);

  return {
    app,
  };
}
