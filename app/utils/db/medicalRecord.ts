import { consultationData } from "@/app/_components/Sections/PatientConsultation";
import prisma from "@/app/client";
import { Prisma } from "@prisma/client";

export async function getPatientMedicalRecords(patientId: string) {
	return prisma.medicalRecord.findMany({
		where: {
			patientId: patientId,
		},
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
					duration: false,
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
	});
}
export async function createMedicalRecord({
	data,
	doctorId,
	patientId,
	appointmentId,
}: {
	data: consultationData;
	patientId: string;
	doctorId: string;
	appointmentId: string;
}) {
	return prisma.medicalRecord.create({
		data: {
			diagnosis: data.diagnosis,
			patientId: patientId,
			doctorId: doctorId,
			appointmentId: appointmentId,
			medicalProcedures: data.examination,
			prescription: {
				createMany: {
					data: data.prescription.map((pres) => {
						return {
							dosage: pres.dosage,
							duration: pres.duration,
							medicationId: pres.medication.id,
							instruction: pres.instruction,
							quantity: pres.quantity,
						};
					}),
				},
			},
		},
	});
}

export type medicalRecord = Prisma.MedicalRecordGetPayload<{
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
}>;

export type prescription = Prisma.PrescriptionGetPayload<{
	include: {
		medication: true;
	};
}>;
