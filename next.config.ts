import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
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

export default nextConfig;
