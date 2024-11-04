import prisma from "@/app/client";
import { Prisma } from "@prisma/client";

export async function getTotalUnpaidDues() {
	const dues = await prisma.invoice.findMany({
		where: {
			status: {
				equals: "Unpaid",
			},
		},
		select: {
			services: true,
		},
	});
	return dues.reduce((acc, cur) => {
		const services = cur.services.reduce((total, current) => {
			return total + current.price;
		}, 0);
		return acc + services;
	}, 0);
}

export async function getLastMonthPayments() {
	const monthInMilliSeconds = 2592000000;
	const lastMonth = new Date(Date.now() - monthInMilliSeconds);
	const payments = await prisma.invoice.findMany({
		where: {
			status: {
				equals: "Paid",
			},
			createdAt: {
				gte: lastMonth,
			},
		},
		select: {
			services: true,
		},
	});
	return payments.reduce((acc, cur) => {
		const services = cur.services.reduce((total, current) => {
			return total + current.price;
		}, 0);
		return acc + services;
	}, 0);
}
export type invoices = Prisma.InvoiceGetPayload<{
	include: {
		services: true;
		Invoice_Medication: { include: { medication: true } };
	};
}>;
