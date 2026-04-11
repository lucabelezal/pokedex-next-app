import withPWAInit from "@ducanh2912/next-pwa";
import type { NextConfig } from "next";

const withPWA = withPWAInit({
  dest: "public",
  // Desativado em dev para não interferir no hot-reload
  disable: process.env.NODE_ENV === "development",
  reloadOnOnline: true,
  workboxOptions: {
    disableDevLogs: true,
    runtimeCaching: [
      {
        // Sprites dos Pokémon (GitHub raw — imutáveis na prática)
        urlPattern: /^https:\/\/raw\.githubusercontent\.com\/PokeAPI\/sprites\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "pokemon-images",
          expiration: {
            maxEntries: 1000,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 dias
          },
        },
      },
      {
        // Chunks JS/CSS do Next.js (nomes hashed — imutáveis)
        urlPattern: /^\/_next\/static\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "next-static",
          expiration: {
            maxEntries: 200,
            maxAgeSeconds: 365 * 24 * 60 * 60, // 1 ano
          },
        },
      },
      {
        // Imagens locais (ícones do app, assets de onboarding etc.)
        urlPattern: /\/assets\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "app-assets",
          expiration: {
            maxEntries: 200,
            maxAgeSeconds: 7 * 24 * 60 * 60, // 7 dias
          },
        },
      },
      {
        // API routes do Next.js
        urlPattern: /^\/api\/.*/i,
        handler: "NetworkFirst",
        options: {
          cacheName: "api-routes",
          networkTimeoutSeconds: 10,
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 24 * 60 * 60, // 1 dia
          },
        },
      },
    ],
  },
});

const nextConfig: NextConfig = {
  // turbopack: {} silencia o aviso de conflito webpack/turbopack gerado pelo next-pwa
  turbopack: {},
  experimental: {
    viewTransition: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/PokeAPI/sprites/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/cadastro",
        destination: "/register",
        permanent: true,
      },
      {
        source: "/favoritos",
        destination: "/favorites",
        permanent: true,
      },
      {
        source: "/perfil",
        destination: "/profile",
        permanent: true,
      },
      {
        source: "/regioes",
        destination: "/regions",
        permanent: true,
      },
      {
        source: "/regioes/:path*",
        destination: "/regions/:path*",
        permanent: true,
      },
    ];
  },
};

export default withPWA(nextConfig);
