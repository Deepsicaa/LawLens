import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode for catching issues early
  reactStrictMode: true,

  // Transpile workspace packages that ship as TypeScript source
  transpilePackages: ["types", "@lawlens/rag"],

  // Allow images from known legal document hosts and Supabase
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "legislation.gov.uk" },
      { protocol: "https", hostname: "indiacode.nic.in" },
    ],
  },

  // Experimental features — App Router and Server Components are stable in v15
  experimental: {
    // Optimize package imports for large icon/animation libraries
    optimizePackageImports: ["lucide-react", "framer-motion", "@radix-ui/react-icons"],
  },
};

export default nextConfig;
