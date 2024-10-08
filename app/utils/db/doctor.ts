import prisma from "@/app/client";
import { Prisma } from "@prisma/client";
import { StaffData } from "./staff";

export async function getDoctorsInDepartment(departmentId: string) {
	const date = new Date();
	date.setHours(0);
	return prisma.doctor.findMany({
		where: {
			staff: {
				departmentId: departmentId,
			},
		},
		include: {
			staff: {
				select: {
					firstName: true,
					middleName: true,
					lastName: true,
				},
			},
			appointments: {
				include: {
					patient: {
						select: {
							firstName: true,
							middleName: true,
							lastName: true,
							mobileNumber: true,
							sex: true,
						},
					},
				},
				where: {
					datetime: {
						gte: date,
					},
				},
			},
		},
	});
}
export async function getDoctor(id: string) {
	return prisma.doctor.findUnique({
		where: {
			staffId: id,
		},
	});
}
export async function getAvailableDoctor({
	date,
	departmentId,
}: {
	date: Date;
	departmentId: string;
}) {
	return prisma.doctor.findMany({
		include: {
			_count: {
				select: {
					appointments: true,
				},
			},
		},
		where: {
			staff: {
				departmentId: departmentId,
			},
			workingHours: {
				some: {
					date: date.toLocaleDateString("en-US", {
						weekday: "long",
					}),
					from: {
						lte: date.getHours(),
					},
					to: {
						gte: date.getHours(),
					},
				},
			},
			appointments: {
				none: {
					datetime: {
						equals: date,
					},
				},
			},
		},
		orderBy: {
			appointments: {
				_count: "asc",
			},
		},
	});
}
export async function getAvailableDoctors({
	startTime,
	endTime,
	departmentId,
}: {
	startTime: Date;
	endTime: Date;
	departmentId: string;
}) {
	return prisma.doctor.findMany({
		where: {
			workingHours: {
				some: {
					date: startTime.toLocaleDateString("en-US", {
						weekday: "long",
					}),
				},
			},
			staff: {
				departmentId: departmentId,
			},
		},
		include: {
			appointments: {
				where: {
					datetime: {
						gte: startTime,
						lte: endTime,
					},
				},
			},
			workingHours: {
				where: {
					date: startTime.toLocaleDateString("en-US", {
						weekday: "long",
					}),
				},
			},
		},
	});
}
export async function createDoctor({
	data,
	workingDays,
	departmentId,
	specialization,
}: {
	data: StaffData;
	workingDays: string[];
	departmentId?: string;
	specialization?: string;
}) {
	return prisma.staff.create({
		data: {
			...data,
			role: {
				connect: {
					name: "Doctor",
				},
			},
			department: {
				connect: {
					id: departmentId,
				},
			},
			doctor: {
				create: {
					workingHours: {
						createMany: {
							data: workingDays.map((day) => {
								return {
									date: day,
									from: 9, // Default but could be changed based on input
									to: 17, // Default but could be changed based on input
								};
							}),
						},
					},
					specialization: specialization,
				},
			},
		},
	});
}

export type doctor = Prisma.DoctorGetPayload<{
	include: {
		staff: {
			select: {
				firstName: true;
				middleName: true;
				lastName: true;
			};
		};
		appointments: {
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
		};
	};
}>;

export type availableDoctor = Prisma.DoctorGetPayload<{
	include: {
		appointments: true;
		workingHours: true;
	};
}>;
