import { Prisma } from "@prisma/client";
import prisma from "../../client";

export async function getPatientAppointments(id: string) {
	const date = new Date();
	return prisma.appointment.findMany({
		where: {
			patientId: id,
			datetime: {
				gt: date,
			},
		},
		include: {
			doctor: {
				select: {
					staff: {
						select: {
							firstName: true,
							middleName: true,
							department: true,
							sex: true,
						},
					},
				},
			},
			MedicalRecord: {
				include: {
					prescription: {
						include: {
							medication: true,
						},
					},
				},
			},
		},
		orderBy: {
			datetime: "desc",
		},
	});
}

export async function getDoctorAppointments(id: string) {
	const now = new Date();
	return prisma.doctor.findUnique({
		where: {
			staffId: id,
		},
		include: {
			appointments: {
				include: {
					patient: {
						select: {
							firstName: true,
							middleName: true,
							lastName: true,
							sex: true,
						},
					},
				},
				where: {
					datetime: {
						gt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
						lt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
					},
				},
				orderBy: {
					datetime: "desc",
				},
			},
		},
	});
}

export async function deleteAppointment(id: string) {
	return prisma.appointment.delete({
		where: {
			id: id,
		},
	});
}

export async function scheduleAppointment({
	date,
	doctorId,
	patientId,
}: {
	doctorId: string;
	date: Date;
	patientId: string;
}) {
	return prisma.appointment.create({
		data: {
			datetime: date,
			patientId: patientId,
			doctorId: doctorId,
		},
		include: {
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
		},
	});
}
export async function updateAppointment({
	appointmentId,
	date,
	doctorId,
}: {
	appointmentId: string;
	date: Date;
	doctorId: string;
}) {
	return prisma.appointment.update({
		where: {
			id: appointmentId,
		},
		data: {
			datetime: date,
			doctorId: doctorId,
		},
		include: {
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
		},
	});
}

export type patientAppointment = Prisma.AppointmentGetPayload<{
	include: {
		doctor: {
			select: {
				staff: {
					select: {
						firstName: true;
						middleName: true;
						department: true;
						sex: true;
					};
				};
			};
		};
		MedicalRecord: {
			include: {
				prescription: {
					include: {
						medication: true;
					};
				};
			};
		};
	};
}>;

export type doctorAppointment = Prisma.AppointmentGetPayload<{
	include: {
		patient: {
			select: {
				firstName: true;
				middleName: true;
				lastName: true;
				sex: true;
			};
		};
	};
}>;

export type patientDoctorappointments = Prisma.AppointmentGetPayload<{
	include: {
		patient: {
			select: {
				firstName: true;
				middleName: true;
				lastName: true;
				mobileNumber: true;
				sex: true;
			};
		};
	};
}>;
