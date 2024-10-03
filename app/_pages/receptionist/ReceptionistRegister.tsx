"use client";
import { registerPatient } from "@/app/_actions/register";
import Button, { variants } from "@/app/_components/Buttons/Button";
import InputBox from "@/app/_components/InputBox";
import Popup from "@/app/_components/Popup";
import {
	faCheckCircle,
	faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
const initialState = {
	message: "",
	description: "",
	error: false,
};
export default function ReceptionistRegister() {
	const [state, formAction, pending] = useFormState(
		registerPatient,
		initialState
	);
	const [open, setOpen] = useState<boolean>(false);
	const form = useRef<HTMLFormElement>(null);
	useEffect(() => {
		if (state?.error !== undefined && !state.error) {
			form.current?.reset();
		}
	}, [state]);
	return (
		<main className="w-full mt-24 flex flex-col items-center gap-3 py-1 px-9 sm:px-5">
			{state?.message && !pending && (
				<Popup isOpen={open}>
					<PopUpMessage
						error={state.error}
						message={state.message}
						password={state.password}
						setOpen={setOpen}
					/>
				</Popup>
			)}
			<form
				className="grid grid-cols-1 lg:grid-cols-2 w-full sm:w-3/4  gap-2 text-sm sm:text-lg break-words border-gray-200 rounded-md border-2 p-9"
				action={formAction}
				onSubmit={() => setOpen(true)}
				ref={form}
			>
				<h1 className="text-3xl lg:col-span-2 font-bold p-2">
					Register Patient
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
				<InputBox label="Occupation" name="occupation" />
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
						label="Cancel"
						variant={variants.Secondary}
						onClick={() => form.current?.reset()}
					/>
					<Button
						label={pending ? "Submitting" : "Save"}
						type="submit"
						variant={variants.Primary}
					/>
				</div>
			</form>
		</main>
	);
}
const PopUpMessage = ({
	error,
	message,
	password,
	setOpen,
}: {
	error: boolean;
	message: string;
	password?: string;
	setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
	return (
		<div className="flex flex-col p-10 m-auto absolute inset-0 bg-white items-center justify-around gap-5 text-center">
			<FontAwesomeIcon
				icon={error ? faXmarkCircle : faCheckCircle}
				className={`text-7xl ${
					error ? "text-red-600" : "text-green-500"
				}`}
			/>
			<p className="text-gray-600 text-xl">{message}</p>

			{password && (
				<p className="text-gray-600 text-xl">
					The patient&apos;s temporary password is{" "}
					<strong>{password}</strong>
				</p>
			)}
			<Button
				label={error ? "Try Again" : "Continue"}
				variant={error ? variants.Error : variants.Success}
				onClick={() => setOpen(false)}
			/>
		</div>
	);
};
