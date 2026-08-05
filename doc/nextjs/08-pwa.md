# PWA (Progressive Web App)

O projeto é um PWA — funciona offline, pode ser instalado na tela inicial, parece um app nativo.

## Configuração

```ts
// next.config.ts
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  reloadOnOnline: true,
  workboxOptions: {
    runtimeCaching: [
      {
        // Sprites dos Pokémon (CDN — imutáveis na prática)
        urlPattern: /^https:\/\/raw\.githubusercontent\.com\/PokeAPI\/sprites\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "pokemon-images",
          expiration: { maxEntries: 1000, maxAgeSeconds: 30 * 24 * 60 * 60 },
        },
      },
      {
        // Chunks JS/CSS do Next.js (nomes hashed — imutáveis)
        urlPattern: /^\/_next\/static\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "next-static",
          expiration: { maxEntries: 200, maxAgeSeconds: 365 * 24 * 60 * 60 },
        },
      },
      {
        // API routes do Next.js
        urlPattern: /^\/api\/.*/i,
        handler: "NetworkFirst",
        options: {
          cacheName: "api-routes",
          networkTimeoutSeconds: 10,
          expiration: { maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 },
        },
      },
    ],
  },
});
```

## Estratégias de Cache

| Recurso | Estratégia | Justificativa |
|---|---|---|
| Imagens de Pokémon | CacheFirst | Nunca mudam (CDN imutável) |
| JS/CSS bundles | CacheFirst | Hash no nome → imutável |
| API routes | NetworkFirst | Tenta rede, fallback cache |
| Assets do app | CacheFirst | Ícones, imagens estáticas |

## Manifest

```ts
// src/app/layout.tsx
export const metadata: Metadata = {
  applicationName: "Pokédex",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Pokédex",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#ececec",
};
```

## Service Worker

Gerado automaticamente pelo `next-pwa`. Registrado via `manifest.webmanifest`. O service worker intercepta todas as requisições e aplica as estratégias de cache definidas.

**Em dev:** desabilitado (`disable: process.env.NODE_ENV === "development"`) para não interferir no hot-reload.

## iOS (Swift)

No iOS nativo, PWAs rodam dentro de uma WKWebView. O `appleWebApp` + `viewport` configuram o comportamento da WebView:
- `statusBarStyle: "black-translucent"` → conteúdo atrás da status bar
- `viewportFit: "cover"` → conteúdo atrás do notch/Dynamic Island
- `userScalable: false` → sem zoom (comporta-se como app nativo)

O `safe-area-inset-*` no CSS cuida do espaçamento:

```css
pt-[calc(14px+env(safe-area-inset-top))]
pb-[calc(22px+env(safe-area-inset-bottom))]
```

## Service Worker Lifecycle

```
install → activate → fetch (intercepta requests)
```

1. **install**: SW é baixado e instalado
2. **activate**: SW assume controle das páginas
3. **fetch**: toda requisição passa pelo SW → aplica cache strategy

## Exercício prático

1. Rode `npm run build && npm run start` — abra no Chrome
2. Chrome DevTools → Application → Service Workers — veja o SW registrado
3. Chrome DevTools → Application → Cache Storage — veja os caches
4. Modo offline (Network → Offline) — o app deve funcionar sem internet
