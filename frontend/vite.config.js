import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
	root: "src/",
	appType: "spa",
	esbuild: {
		jsxFactory: 'h',
		jsxFragment: 'Fragment',
	},
	build: {
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