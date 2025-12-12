import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
	root: "src/",
	build: {
    lib: {
      entry: "./index.ts",
      name: "Closing-Connect API"
    },
		outDir: "../build/",
    emptyOutDir: true,
		minify: "false",
		rollupOptions: {
			output: {
				entryFileNames: "index.js",
			},
		},
	},
	vite: {
		define: {
			"global": {},
		}
	}
});