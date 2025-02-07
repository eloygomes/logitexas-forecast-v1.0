import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

const DEV_PORT = 2121;

// https://astro.build/config
export default defineConfig({
  // Seu domínio real
  site: "https://logihub.space",

  // Gera arquivos estáticos para hospedagem (SSG)
  output: "static",

  build: {
    rollupOptions: {
      output: {
        // Opcional: Divide pacotes grandes em "vendor" e "common"
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
          return "common";
        },
      },
    },
  },

  server: {
    port: DEV_PORT, // Apenas para desenvolvimento local
  },

  integrations: [sitemap(), tailwind(), react()],
  middleware: ["src/middleware/auth.ts"], // Ativando o middleware
});
