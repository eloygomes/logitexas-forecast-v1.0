// import { defineConfig } from "astro/config";
// import sitemap from "@astrojs/sitemap";
// import tailwind from "@astrojs/tailwind";
// import react from "@astrojs/react";

// const DEV_PORT = 2121;

// // https://astro.build/config
// export default defineConfig({
//   // Seu domínio real
//   site: "https://logihub.space",

//   // Gera arquivos estáticos para hospedagem (SSG)
//   output: "static",

//   build: {
//     rollupOptions: {
//       output: {
//         // Opcional: Divide pacotes grandes em "vendor" e "common"
//         manualChunks(id) {
//           if (id.includes("node_modules")) {
//             return "vendor";
//           }
//           return "common";
//         },
//       },
//     },
//   },

//   server: {
//     port: DEV_PORT, // Apenas para desenvolvimento local
//   },

//   integrations: [sitemap(), tailwind(), react()],
//   middleware: ["src/middleware/auth.ts"], // Ativando o middleware
// });

import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import { fileURLToPath, URL } from "url";

const DEV_PORT = 2121;

export default defineConfig({
  site: "https://logihub.space",
  output: "static",
  build: {
    rollupOptions: {
      output: {
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
    port: DEV_PORT,
  },
  integrations: [sitemap(), tailwind(), react()],
  middleware: ["src/middleware/auth.ts"],
  vite: {
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  },
});
