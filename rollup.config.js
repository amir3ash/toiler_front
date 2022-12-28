import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import livereload from "rollup-plugin-livereload";
import { terser } from "@rollup/plugin-terser";
import css from 'rollup-plugin-css-only';
import del from 'rollup-plugin-delete'
import gzipPlugin from 'rollup-plugin-gzip'
import { brotliCompress } from 'zlib'
import { promisify } from 'util'
import typescript from '@rollup/plugin-typescript';
// import typescript from "rollup-plugin-typescript2";
import autoPreprocess from 'svelte-preprocess';
import sucrase from '@rollup/plugin-sucrase';

// library that helps you import in svelte with
// absolute paths, instead of
// import Component  from "../../../../components/Component.svelte";
// we will be able to say
// import Component from "components/Component.svelte";
import alias from "@rollup/plugin-alias";
import fs from "fs";

const brotliPromise = promisify(brotliCompress)

const production = !process.env.ROLLUP_WATCH;

// configure aliases for absolute imports
const aliases = alias({
  resolve: [".svelte", ".js", ".ts"], //optional, by default this will just look for .js files or folders
  entries: [
    { find: "components", replacement: "src/components" },
    { find: "views", replacement: "src/views" },
    { find: "assets", replacement: "src/assets" },
  ],
});

const indexTemplate = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />

    <link rel="shortcut icon" href="/assets/img/favicon-32.png" />
    <link rel="stylesheet" href="/build/bundles/bundle.css" />
    <link
      rel="stylesheet"
      href="/assets/vendor/@fortawesome/fontawesome-free/css/min_font.css"
    />
    <link rel="stylesheet" href="/assets/styles/tailwind.css" />
    <title>Toiler</title>

    <script>
      if (process === undefined) {
        var process = { env: {<<process-env-status>>} };
      }
    </script>
    
    <script defer type="module" src="<<live-preview-link>>/build/bundles/main.js"></script>
    <script defer nomodule src="<<live-preview-link>>/build/bundle.js"></script>
  </head>

  <body class="text-blueGray-700 antialiased">
    <noscript>
      <strong
        >We're sorry but it doesn't work properly without
        JavaScript enabled. Please enable it to continue.</strong
      >
    </noscript>
    <div id="app"></div>
  </body>
</html>
`;

if (production) {
  fs.writeFileSync(
    "./public/index.html",
    indexTemplate
      .replace("<<process-env-status>>", "PRODUCTION: true")
      .replace(/<<live-preview-link>>/g, "")
  );
  fs.writeFileSync(
    "./public/200.html",
    indexTemplate
      .replace("<<process-env-status>>", "PRODUCTION: true")
      .replace(/<<live-preview-link>>/g, "")
  );
  fs.writeFileSync(
    "./public/404.html",
    indexTemplate
      .replace("<<process-env-status>>", "PRODUCTION: true")
      .replace(/<<live-preview-link>>/g, "")
  );
} else {
  fs.writeFileSync(
    "./public/index.html",
    indexTemplate
      .replace("<<process-env-status>>", "")
      .replace(/<<live-preview-link>>/g, "")
  );
  fs.writeFileSync(
    "./public/200.html",
    indexTemplate
      .replace("<<process-env-status>>", "")
      .replace(/<<live-preview-link>>/g, "")
  );
  fs.writeFileSync(
    "./public/404.html",
    indexTemplate
      .replace("<<process-env-status>>", "")
      .replace(/<<live-preview-link>>/g, "")
  );
}

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require("child_process").spawn(
        "npm",
        ["run", "start", "--", "--dev"],
        {
          stdio: ["ignore", "inherit", "inherit"],
          shell: true,
        }
      );

      process.on("SIGTERM", toExit);
      process.on("exit", toExit);
    },
  };
}

/** @type {import('rollup').RollupOptions} */
export default {
  input: "src/main.ts",
  output: [
    {
      sourcemap: !production,
      format: "es",
      name: "app",
      dir: "public/build/bundles/"
    },
    // {
    //   sourcemap: true,
    //   format: "iife",
    //   name: "app",
    //   file: "public/build/bundle.js",
    //   inlineDynamicImports: true
    // }
  ],
  plugins: [
    !production && del({
       targets: [
          'public/build/bundles/*.js',
          'public/build/bundles/*.js.map',
          'public/build/bundles/*.gz',
          'public/build/bundles/*.br',
          'public/assets/styles/tailwind.css.*',
        ]
      }),
    svelte({
      preprocess: autoPreprocess(),
      compilerOptions: {
          // enable run-time checks when not in production
          dev: !production,
      }
    }),
    // we'll extract any component CSS out into
    // a separate file - better for performance
    css({ output: 'bundle.css' }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    
    sucrase({
      production: production,
      
      exclude: ['node_modules/**'],
      transforms: ['typescript']
    }),
    resolve({
        browser: true,
        dedupe: ['svelte'],
        extensions: ['ts', 'js', 'svelte']
    }),
    commonjs(),
		// typescript({ sourceMap: !production }),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload("public"),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),

    // GZIP compression as .gz files
    production && gzipPlugin({
      minSize: 1024,
      additionalFiles:['public/assets/styles/tailwind.css']
    }),
    // Brotil compression as .br files
    production && gzipPlugin({
      customCompression: content => brotliPromise(Buffer.from(content)),
      fileName: '.br',
      minSize: 1024,
      additionalFiles:['public/assets/styles/tailwind.css']
    }),

    // for absolut imports
    // i.e., instead of
    // import Component  from "../../../../components/Component.svelte";
    // we will be able to say
    // import Component from "components/Component.svelte";
    aliases,
  ],
  watch: {
    clearScreen: false,
  },
};
