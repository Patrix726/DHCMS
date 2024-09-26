import prisma from "@/app/client";

export async function getDiseases(value: string) {
	return prisma.diseases.findMany({
		where: {
			name: {
				contains: value,
				mode: "insensitive",
			},
		},
		take: 5,
	});
}
