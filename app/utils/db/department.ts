import prisma from "@/app/client";

export async function getDepartments() {
	return prisma.department.findMany();
}
