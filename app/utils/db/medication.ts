import prisma from "@/app/client";

export async function getMedications(name: string) {
	return prisma.medication.findMany({
		where: {
			OR: [
				{
					name: {
						contains: name,
						mode: "insensitive",
					},
				},
				{
					description: {
						contains: name,
						mode: "insensitive",
					},
				},
			],
		},
		take: 5,
	});
}
