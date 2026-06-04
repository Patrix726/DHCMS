import path from "node:path";
import dotenv from "dotenv";
import { defineConfig, env } from "prisma/config";

const isTest = process.env.NODE_ENV === "test";

dotenv.config({
	path: isTest ? [".env.test", ".env.test.local"] : [".env.local", ".env"],
	quiet: true,
});

export default defineConfig({
	schema: path.join("prisma", "schema"),
	migrations: {
		path: path.join("prisma", "migrations"),
		seed: "tsx prisma/seed.ts",
	},
	datasource: {
		url: env("DATABASE_URL"),
	},
});
