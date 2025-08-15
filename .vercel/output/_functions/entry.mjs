import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_DHzxPgdl.mjs';
import { manifest } from './manifest_twNw0B91.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/contact.astro.mjs');
const _page2 = () => import('./pages/blog/ai-agents-future.astro.mjs');
const _page3 = () => import('./pages/blog/psychology-driven-design.astro.mjs');
const _page4 = () => import('./pages/blog/scalable-ai-applications.astro.mjs');
const _page5 = () => import('./pages/blogs.astro.mjs');
const _page6 = () => import('./pages/concepts.astro.mjs');
const _page7 = () => import('./pages/concepts-original-backup.astro.mjs');
const _page8 = () => import('./pages/spline-demo.astro.mjs');
const _page9 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/contact.ts", _page1],
    ["src/pages/blog/ai-agents-future.astro", _page2],
    ["src/pages/blog/psychology-driven-design.astro", _page3],
    ["src/pages/blog/scalable-ai-applications.astro", _page4],
    ["src/pages/blogs.astro", _page5],
    ["src/pages/concepts.astro", _page6],
    ["src/pages/concepts-original-backup.astro", _page7],
    ["src/pages/spline-demo.astro", _page8],
    ["src/pages/index.astro", _page9]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "3fe32d8d-33d2-4217-8065-236ccc02297f",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
