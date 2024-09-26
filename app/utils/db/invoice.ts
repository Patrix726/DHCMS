import { Prisma } from "@prisma/client";

export type invoices = Prisma.InvoiceGetPayload<{
	include: {
		services: true;
		Invoice_Medication: { include: { medication: true } };
	};
}>;
