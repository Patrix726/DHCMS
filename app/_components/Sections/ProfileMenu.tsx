"use client";
import {
	faCheckCircle,
	faLock,
	faMoon,
	faUser,
	faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useProfilePopup } from "../../_hooks/useProfilePopup";
import Popup from "../Popups/Popup";
import InputBox from "../Inputs/InputBox";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { changePassword } from "../../_actions/user";
import { useFormState } from "react-dom";
import Button, { variants } from "../Buttons/Button";

const ProfileMenu = ({ user }: { user: Session }) => {
	const { open, setOpen, menuRef } = useProfilePopup();
	const [popup, setPopup] = useState<boolean>(false);
	const [popupKey, setKey] = useState<number>(0);
	return (
		<div className="relative flex z-20 items-center gap-3">
			<p className="text-sm text-gray-700">Hi, {user?.user.name}</p>
			<FontAwesomeIcon
				icon={faUserCircle}
				width={30}
				className="cursor-pointer"
				onClick={(e) => {
					e.stopPropagation();
					setOpen((prev) => !prev);
				}}
			/>
			{open && (
				<div
					className="absolute top-16 right-0 flex flex-col w-max text-lg font-sans justify-start items-start bg-slate-100 rounded-md shadow"
					ref={menuRef}
				>
					<div className="w-full hover:bg-blue-950 hover:text-white px-5 py-2  cursor-pointer rounded-md flex gap-3 items-center">
						<FontAwesomeIcon icon={faMoon} />
						<span>Dark Mode</span>
					</div>
					<div
						className="w-full hover:bg-blue-950 hover:text-white px-5 py-2 cursor-pointer rounded-md flex gap-3 items-center"
						onClick={() => setPopup(true)}
					>
						<FontAwesomeIcon icon={faLock} />
						<span>Change Password</span>
					</div>
					<div
						className="w-full hover:bg-blue-950 hover:text-white px-5 py-2 cursor-pointer rounded-md flex gap-3 items-center"
						onClick={() => signOut()}
					>
						<FontAwesomeIcon icon={faUser} />
						<span>Logout</span>
					</div>
				</div>
			)}
			<ChangePasswordForm
				isOpen={popup}
				setOpen={setPopup}
				key={popupKey}
				onReset={() => setKey((prev) => prev + 1)}
			/>
		</div>
	);
};

const initialState = {
	message: "",
	error: false,
};
function ChangePasswordForm({
	isOpen,
	setOpen,
	onReset,
}: {
	isOpen: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	onReset: () => void;
}) {
	const [state, formAction, pending] = useFormState(
		changePassword,
		initialState
	);
	const form = useRef<HTMLFormElement>(null);
	return (
		<Popup isOpen={isOpen}>
			{state.message && !state.error ? (
				<div className="flex flex-col p-10 m-auto absolute inset-0 bg-white items-center justify-around gap-5 text-center">
					<FontAwesomeIcon
						icon={faCheckCircle}
						className={`text-7xl ${
							state.error ? "text-red-600" : "text-green-500"
						}`}
					/>
					<p className="text-gray-600 text-xl">{state.message}</p>

					<Button
						label={state.error ? "Try Again" : "Continue"}
						variant={
							state.error ? variants.Error : variants.Success
						}
						onClick={() => {
							onReset();
							setOpen(false);
						}}
					/>
				</div>
			) : (
				<form
					action={formAction}
					className="text-lg flex flex-col gap-2 text-gray-700"
					onReset={onReset}
					ref={form}
				>
					{state.error && (
						<h1 className="top-0 left-0 p-4 w-full text-center bg-red-200 rounded-t-2xl text-red-800">
							{state.message}
						</h1>
					)}
					<div className="p-8">
						<h1 className="text-gray-800 text-3xl ml-1 mb-6">
							Change your password
						</h1>
						<div className="flex flex-col gap-4">
							<InputBox
								label="Previous Password"
								name="prevPass"
								required
								placeholder="Enter your previous password"
								type="password"
							/>
							<InputBox
								label="New Password"
								name="newPass"
								required
								placeholder="Enter your new password"
								type="password"
							/>
							<InputBox
								label="Confirm Password"
								name="confirmPass"
								required
								placeholder="Confirm your new password"
								type="password"
							/>
						</div>
						<div className="flex w-full justify-end gap-2 mt-12">
							<Button
								label="Cancel"
								onClick={() => {
									form.current?.reset();
									setOpen(false);
								}}
								variant={variants.Secondary}
							/>
							<Button
								label="Save"
								type="submit"
								variant={variants.Primary}
							/>
						</div>
					</div>
				</form>
			)}
		</Popup>
	);
}
export default ProfileMenu;
