"use client";
import { registerStaff } from "@/app/_actions/register";
import Button, { variants } from "@/app/_components/Buttons/Button";
import InputBox from "@/app/_components/Inputs/InputBox";
import ErrorPopup from "@/app/_components/Popups/Error";
import SuccessPopup from "@/app/_components/Popups/Success";
import { Department, Role } from "@prisma/client";
import React from "react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
const initialState = {
	message: "",
	description: "",
	error: false,
};
export default function AdminRegister({
	departments,
	roles,
}: {
	departments: Department[];
	roles: Role[];
}) {
	const [state, formAction, pending] = useFormState(
		registerStaff,
		initialState
	);
	const [open, setOpen] = useState<boolean>(false);
	const [role, setRole] = useState<string>("role-doctor");
	const form = useRef<HTMLFormElement>(null);
	useEffect(() => {
		if (state?.error !== undefined && !state.error) {
			form.current?.reset();
		}
	}, [state]);
	const existingDepartments = departments.map((dep) => {
		return (
			<option key={dep.id} value={dep.id}>
				{dep.name}
			</option>
		);
	});
	const existingRoles = roles.map((role) => {
		return (
			<option key={role.id} value={role.id}>
				{role.name}
			</option>
		);
	});
	return (
		<main className="w-full mt-24 flex flex-col items-center gap-3 py-1 px-9 sm:px-5">
			{state?.message && !pending && (
				<PopUpMessage
					isOpen={open}
					error={state.error}
					message={state.message}
					password={state.password}
					username={state.username}
					setOpen={setOpen}
				/>
			)}
			<form
				className="grid grid-cols-1 lg:grid-cols-2 w-full sm:w-3/4  gap-2 text-sm sm:text-lg break-words border-gray-200 rounded-md border-2 p-9"
				action={formAction}
				onSubmit={() => setOpen(true)}
				ref={form}
			>
				<h1 className="text-3xl lg:col-span-2 font-bold p-2">
					Register Staff
				</h1>
				<h2 className="text-xl lg:col-span-2 font-bold p-2">
					Personal Information:
				</h2>
				<InputBox label="First Name" name="firstName" required={true} />
				<InputBox
					label="Middle Name"
					name="middleName"
					required={true}
				/>
				<InputBox label="Last Name" name="lastName" required={true} />
				<label className="flex flex-col gap-2 ">
					<span className="p-2 w-1/3 max-w-48">Sex:</span>
					<select
						className="ml-2 p-2 w-3/5 max-w-96 border border-gray-200 rounded-md"
						name="sex"
						required
					>
						<option value="MALE">Male</option>
						<option value="FEMALE">Female</option>
					</select>
				</label>
				<InputBox
					label="Birthdate"
					name="birthDate"
					type="date"
					required={true}
				/>
				<h2 className="text-xl lg:col-span-2 font-bold p-2 mt-7">
					Work Information:
				</h2>
				<label className="flex flex-col gap-2 ">
					<span className="p-2 w-1/3 max-w-48">Role:</span>
					<select
						className="ml-2 p-2 w-3/5 max-w-96 border border-gray-200 rounded-md"
						name="role"
						onChange={(e) => setRole(e.target.value)}
						required
					>
						{existingRoles}
					</select>
				</label>
				{(role.includes("doctor") || role.includes("receptionist")) && (
					<label className="flex flex-col gap-2 ">
						<span className="p-2 w-1/3 max-w-48">Department:</span>
						<select
							className="ml-2 p-2 w-3/5 max-w-96 border border-gray-200 rounded-md"
							name="department"
							required
						>
							{existingDepartments}
						</select>
					</label>
				)}
				{role.includes("doctor") && <WorkingDaysInput />}
				{role.includes("doctor") && (
					<InputBox label="Specialization" name="specialization" />
				)}
				{/* <WorkingHourInput
					selectedDays={selectedDays}
					setSelectedDays={setSelectedDays}
				/> */}
				<h2 className="text-xl lg:col-span-2 font-bold p-2 mt-7">
					Address:
				</h2>
				<InputBox label="Region" name="region" required={true} />
				<InputBox label="City" name="city" required={true} />
				<InputBox label="Woreda" name="woreda" required={true} />
				<InputBox label="Kebele" name="kebele" />
				<InputBox label="Mobile No." name="mobileNo" required={true} />
				<InputBox label="Email" name="email" />
				<InputBox
					label="Emergency Contact Name"
					name="emergencyContactName"
				/>
				<InputBox
					label="Emergency Contact Mobile No."
					name="emergencyContactPhone"
				/>

				<div className="lg:col-span-2 flex justify-end w-3/4 m-auto mt-9 gap-2">
					<Button
						variant={variants.Secondary}
						label="Cancel"
						onClick={() => form.current?.reset()}
					/>
					<Button
						variant={variants.Primary}
						label={pending ? "Submitting" : "Save"}
						type="submit"
					/>
				</div>
			</form>
		</main>
	);
}
const PopUpMessage = ({
	isOpen,
	error,
	message,
	password,
	username,
	setOpen,
}: {
	isOpen: boolean;
	error: boolean;
	message: string;
	password?: string;
	username?: string;
	setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
	const messageComp = (
		<>
			<p className="text-gray-600 text-xl">{message}</p>
			{username && (
				<p className="text-gray-600 text-xl">
					The staff&apos;s username is <strong>{username}</strong>
				</p>
			)}
			{password && (
				<p className="text-gray-600 text-xl">
					The staff&apos;s temporary password is{" "}
					<strong>{password}</strong>
				</p>
			)}
		</>
	);
	return (
		<>
			{error ? (
				<ErrorPopup
					isOpen={isOpen}
					handleClick={() => setOpen(false)}
					buttonLabel="Try Again"
				>
					{messageComp}
				</ErrorPopup>
			) : (
				<SuccessPopup
					isOpen={isOpen}
					handleClick={() => setOpen(false)}
					buttonLabel="Continue"
				>
					{messageComp}
				</SuccessPopup>
			)}
		</>
	);
};
const WorkingDaysInput = () => {
	const days = [
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];
	const options = days.map((day, ind) => {
		return (
			<label className="flex gap-2 text-lg py-1" key={ind}>
				<input
					type="checkbox"
					name="workingDays"
					id="workingDay"
					value={day}
					checked={ind < 5}
				/>
				<span>{day}</span>
			</label>
		);
	});
	return (
		<div className="flex flex-col gap-2 w-3/4">
			<span className="p-2 w-1/3 max-w-48">Working Days:</span>
			<div className="grid grid-cols-3  p-2 gap-2">{options}</div>
		</div>
	);
};
const WorkingHourInput = ({
	selectedDays,
	setSelectedDays,
}: {
	selectedDays: string[];
	setSelectedDays: Dispatch<SetStateAction<string[]>>;
}) => {
	// const [selectedDays, setSelectedDays] = useState<string[]>([]);

	const days = [
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];
	function handleSelect(day: string) {
		if (selectedDays.includes(day)) {
			setSelectedDays((prev) => prev.filter((sel) => sel != day));
		} else {
			setSelectedDays((prev) => prev.concat(day));
		}
	}
	const options = days.map((day, ind) => {
		return (
			<div
				className={`p-2 rounded-md ${
					selectedDays.includes(day) ? "bg-orange-300" : "bg-gray-100"
				} cursor-pointer`}
				key={ind}
				onClick={() => handleSelect(day)}
			>
				{day.slice(0, 3)}
			</div>
		);
	});
	return (
		<label className="flex flex-col gap-2 ">
			<span className="p-2 w-1/3 max-w-48">Working days:</span>
			<div className="ml-2 p-2 w-3/5 flex border border-gray-200 rounded-md justify-between flex-wrap">
				{options}
			</div>
		</label>
	);
};
