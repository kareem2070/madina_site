import getNextConfig from "./next.config.mjs";
import { default as nextBuild } from "next/dist/build";
import { default as nextExport } from "next/dist/export";

const buildAndExport = async () => {
  try {
    const config = await getNextConfig();
    await nextBuild(config);
    await nextExport(config);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

buildAndExport();
