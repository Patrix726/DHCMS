import prisma from "@/app/client";
import { Prisma } from "@prisma/client";

export async function getPatients({
	firstName,
	middleName,
	lastName,
	mobileNo,
	email,
}: {
	firstName: string;
	middleName: string;
	lastName: string;
	mobileNo: string;
	email: string;
}) {
	return prisma.patient.findMany({
		where: {
			firstName: {
				contains: firstName,
				mode: "insensitive",
			},
			middleName: {
				contains: middleName,
				mode: "insensitive",
			},
			lastName: {
				contains: lastName,
				mode: "insensitive",
			},
			mobileNumber: {
				contains: mobileNo,
				mode: "insensitive",
			},
			email: {
				contains: email,
				mode: "insensitive",
			},
		},
		select: {
			firstName: true,
			middleName: true,
			lastName: true,
			birthDate: true,
			sex: true,
			id: true,
		},
	});
}
export async function getPatient(id: string) {
	return prisma.patient.findUnique({
		where: {
			id: id,
		},
		select: {
			password: false,
			email: false,
			firstName: true,
			middleName: true,
			lastName: true,
			birthDate: true,
			mobileNumber: true,
			sex: true,
			occupation: true,
			medicalRecords: {
				select: {
					doctor: {
						select: {
							staff: {
								select: {
									firstName: true,
									middleName: true,
								},
							},
						},
					},
					diagnosis: true,
					appointment: {
						select: {
							datetime: true,
						},
					},
					prescription: {
						select: {
							dosage: true,
							duration: true,
							instruction: true,
							medication: true,
						},
					},
					id: true,
					symptoms: true,
					medsInstruction: true,
				},
				orderBy: {
					appointment: {
						datetime: "desc",
					},
				},
			},
			patientRecord: true,
			appointments: true,
		},
	});
}
export async function getPatientDueInvoices(id: string) {
	return prisma.invoice.findMany({
		where: {
			patient: { id: id },
			status: "Unpaid",
		},
		include: {
			services: true,
			Invoice_Medication: { include: { medication: true } },
		},
	});
}
export async function getPatientPaidInvoices(id: string) {
	return prisma.invoice.findMany({
		where: {
			patient: { id: id },
			status: "Paid",
		},
		include: {
			services: true,
			Invoice_Medication: { include: { medication: true } },
		},
	});
}

export type patient = Prisma.PatientGetPayload<{
	select: {
		password: false;
		email: false;
		firstName: true;
		middleName: true;
		lastName: true;
		birthDate: true;
		mobileNumber: true;
		sex: true;
		occupation: true;
		medicalRecords: {
			select: {
				doctor: {
					select: {
						staff: {
							select: {
								firstName: true;
								middleName: true;
							};
						};
					};
				};
				diagnosis: true;
				appointment: {
					select: {
						datetime: true;
					};
				};
				prescription: {
					select: {
						dosage: true;
						duration: true;
						instruction: true;
						medication: true;
					};
				};
				id: true;
				symptoms: true;
				medsInstruction: true;
			};
		};
		patientRecord: true;
		appointments: true;
	};
}>;
