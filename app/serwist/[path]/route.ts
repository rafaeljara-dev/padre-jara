import { createSerwistRoute } from "@serwist/turbopack";
import { spawnSync } from "node:child_process";

const revision =
  spawnSync("git", ["rev-parse", "HEAD"], { encoding: "utf-8" }).stdout?.trim() ??
  crypto.randomUUID();

const pagesToPrecache = [
  "/dashboard",
  "/cotizaciones",
  "/historial",
  "/offline.html",
].map((url) => ({ url, revision }));

export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } =
  createSerwistRoute({
    additionalPrecacheEntries: pagesToPrecache,
    swSrc: "app/sw.ts",
    useNativeEsbuild: true,
  });
