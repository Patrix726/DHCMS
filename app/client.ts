import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../prisma/generated/client.js";

// In tests, prefer the standard PG adapter to avoid Neon WebSocket requirements
// in Node test environments.
const usePgAdapter =
	process.env.NODE_ENV === "test" || process.env.NODE_ENV === "development";

const adapter = usePgAdapter
	? new PrismaPg({
			connectionString: process.env.DATABASE_URL,
		})
	: new PrismaNeon({
			connectionString: process.env.DATABASE_URL,
		});

const prisma = new PrismaClient({ adapter });

export { prisma };
export default prisma;
