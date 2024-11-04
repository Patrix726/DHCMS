import prisma from "@/app/client";
import { Prisma } from "@prisma/client";

export async function createStaff({
	data,
	departmentId,
	role,
}: {
	data: StaffData;
	departmentId?: string;
	role?: string;
}) {
	return prisma.staff.create({
		data: {
			...data,
			role: {
				connect: {
					id: role,
				},
			},
			department: {
				connect: {
					id: departmentId,
				},
			},
		},
	});
}
export async function getStaffRoles() {
	return prisma.role.findMany();
}
export async function getTotalNumberOfStaff() {
	return prisma.staff.count();
}

export type StaffData = Prisma.StaffGetPayload<{
	select: {
		birthDate: true;
		city: true;
		email: true;
		emergencyContact: true;
		emergencyContactMobileNo: true;
		employmentStatus: true;
		firstName: true;
		kebele: true;
		lastName: true;
		middleName: true;
		mobileNumber: true;
		password: true;
		region: true;
		sex: true;
		username: true;
		woreda: true;
	};
}>;
