"use server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import prisma from "../client";
import { z } from "zod";
import { Sex } from "@prisma/client";
import { createStaff, StaffData } from "../utils/db/staff";
import { createDoctor } from "../utils/db/doctor";

const registerPatientSchema = z.object({
	firstName: z.string().min(3, { message: "First name is required" }),
	middleName: z.string().min(2, { message: "Middle name is required" }),
	lastName: z.string().min(3, { message: "Last name is required" }),
	mobileNumber: z
		.string({ message: "Phone number is required" })
		.min(10, { message: "Phone number must be at least 10 digits" }),
	email: z.string().email({ message: "Invalid email address" }),
	emergencyContactName: z
		.string()
		.min(3, { message: "Emergency Contact name is required" }),
	emergencyContactMobileNo: z
		.string({ message: "Emergency contact's phone number is required" })
		.min(10, {
			message:
				"Emergency contact's phone number must be at least 10 digits",
		}),
});

export async function registerPatient(initialState: any, formData: FormData) {
	const birthDate = new Date(formData.get("birthDate") as string);
	const password = generatePassword(8);
	const data = {
		birthDate: birthDate,
		city: formData.get("city") as string,
		firstName: formData.get("firstName") as string,
		middleName: formData.get("middleName") as string,
		lastName: formData.get("lastName") as string,
		sex: formData.get("sex") as Sex,
		mobileNumber: formData.get("mobileNo") as string,
		email: formData.get("email") as string,
		region: formData.get("region") as string,
		woreda: formData.get("woreda") as string,
		kebele: formData.get("kebele")?.toString() as string,
		occupation: formData.get("occupation") as string,
		emergencyContactName: formData.get("emergencyContactName") as string,
		emergencyContactMobileNo: formData.get(
			"emergencyContactPhone"
		) as string,
		password: password,
	};
	const parsed = registerPatientSchema.safeParse(data);
	if (!parsed.success) {
		return {
			message: parsed.error.errors[0].message,
			error: true,
		};
	}
	try {
		const patient = await prisma.patient.create({
			data: data,
		});
		if (patient) {
			return {
				message: "Patient registered successfully",
				password: patient.password,
				error: false,
			};
		}
	} catch (e) {
		if (e instanceof PrismaClientKnownRequestError) {
			if (e.code === "P2002") {
				const target = e.meta?.target;
				if (typeof target === "string" && target.includes("email")) {
					return {
						message: "A user already exists with this email",
						error: true,
					};
				} else if (
					typeof target === "string" &&
					target.includes("mobileNumber")
				) {
					return {
						message: "A user already exists with this phone number",
						error: true,
					};
				}
			}
		}
		console.log(e);
		return {
			message: "There was an error when registering the patient",
			error: true,
		};
	}
}

const registerStaffSchema = z.object({
	firstName: z.string().min(3, { message: "First name is required" }),
	middleName: z.string().min(2, { message: "Middle name is required" }),
	lastName: z.string().min(3, { message: "Last name is required" }),
	mobileNumber: z
		.string({ message: "Phone number is required" })
		.min(10, { message: "Phone number must be at least 10 digits" }),
	email: z.string().email({ message: "Invalid email address" }),
	emergencyContact: z
		.string()
		.min(3, { message: "Emergency Contact name is required" }),
	emergencyContactMobileNo: z
		.string({ message: "Emergency contact's phone number is required" })
		.min(10, {
			message:
				"Emergency contact's phone number must be at least 10 digits",
		}),
});

export async function registerStaff(initialState: any, formData: FormData) {
	const birthDate = new Date(formData.get("birthDate") as string);
	const password = generatePassword(8);
	const role = formData.get("role")?.toString();
	const departmentId = formData.get("department")?.toString();
	const isDoctor = typeof role !== "undefined" && role?.includes("doctor");
	const data: StaffData = {
		birthDate: birthDate,
		city: formData.get("city") as string,
		firstName: formData.get("firstName") as string,
		middleName: formData.get("middleName") as string,
		lastName: formData.get("lastName") as string,
		sex: formData.get("sex") as Sex,
		mobileNumber: formData.get("mobileNo") as string,
		email: formData.get("email") as string,
		region: formData.get("region") as string,
		woreda: formData.get("woreda") as string,
		kebele: formData.get("kebele")?.toString() as string,
		emergencyContact: formData.get("emergencyContactName") as string,
		emergencyContactMobileNo: formData.get(
			"emergencyContactPhone"
		) as string,
		password: password,
		employmentStatus: "Active",
		username: generateUsername({
			birthDay: birthDate.getDate(),
			firstName: formData.get("firstName") as string,
			lastName: formData.get("lastName") as string,
			isDoctor: isDoctor,
		}),
	};
	const parsed = registerStaffSchema.safeParse(data);
	if (!parsed.success) {
		return {
			message: parsed.error.errors[0].message,
			error: true,
		};
	}

	try {
		if (isDoctor) {
			const workingDays = formData.getAll("workingDays") as string[];
			if (workingDays.length == 0) {
				return {
					message: "Atleast one working day must be selected",
					error: true,
				};
			}
			const doctor = await createDoctor({
				data: data,
				departmentId: departmentId,
				workingDays: workingDays,
				specialization: formData.get("specialization")?.toString(),
			});
			if (doctor) {
				console.log(doctor.password);
				return {
					message: "Doctor registered successfully",
					password: doctor.password,
					error: false,
					username: doctor.username,
				};
			}
		}
		const staff = await createStaff({
			data: data,
			role: role,
			departmentId: departmentId,
		});
		if (staff) {
			return {
				message: "Staff registered successfully",
				password: staff.password,
				error: false,
				username: staff.username,
			};
		}
	} catch (e) {
		if (e instanceof PrismaClientKnownRequestError) {
			if (e.code === "P2002") {
				const target = e.meta?.target;
				if (typeof target === "string" && target.includes("email")) {
					return {
						message:
							"A staff member already exists with this email",
						error: true,
					};
				} else if (
					typeof target === "string" &&
					target.includes("mobileNumber")
				) {
					return {
						message:
							"A staff member already exists with this phone number",
						error: true,
					};
				}
			}
		}
		console.log(e);
		return {
			message: "There was an error when registering the staff member",
			error: true,
		};
	}
}

function generatePassword(length: number): string {
	let result = "";
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const charactersLength = characters.length;
	let counter = 0;
	while (counter < length) {
		result += characters.charAt(
			Math.floor(Math.random() * charactersLength)
		);
		counter += 1;
	}
	return result;
}

function generateUsername({
	firstName,
	lastName,
	birthDay,
	isDoctor,
}: {
	firstName: string;
	lastName: string;
	isDoctor: boolean;
	birthDay: number;
}): string {
	const username = `${
		isDoctor ? "dr" : ""
	}${firstName.toLowerCase()}${lastName.toLowerCase()}${birthDay}`;
	return username;
}
