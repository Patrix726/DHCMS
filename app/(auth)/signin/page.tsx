"use client";
import { signIn } from "next-auth/react";
import DocIcon from "@/public/Icons/stethoscope.png";
import ReceptionIcon from "@/public/Icons/reception.png";
import PatientIcon from "@/public/Icons/patient.png";
import AdminIcon from "@/public/Icons/administrator.png";
import { MouseEventHandler, ReactNode, useRef, useState } from "react";
import Image, { StaticImageData } from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

type demoRole = {
	id: number;
	role: string;
	phoneNo: string;
	password: string;
	icon: StaticImageData;
};

const DEMO_USER_CREDENTIALS: demoRole[] = [
	{
		id: 0,
		role: "Patient",
		phoneNo: "0911000000",
		password: "hashed_password",
		icon: PatientIcon,
	},
	{
		id: 1,
		role: "Doctor",
		phoneNo: "0912345678",
		password: "securepassword123",
		icon: DocIcon,
	},
	{
		id: 2,
		role: "Receptionist",
		phoneNo: "0912345679",
		password: "securepassword456",
		icon: ReceptionIcon,
	},
	{
		id: 3,
		role: "Administrator",
		phoneNo: "0912345680",
		password: "securepassword789",
		icon: AdminIcon,
	},
];

export default function SignIn({
	searchParams,
}: {
	searchParams?: { callbackUrl?: string; error?: string };
}) {
	const phoneInput = useRef("");
	const passInput = useRef("");
	const [selectedRole, setSelectedRole] = useState(0);
	const [dropdown, setDropdown] = useState(false);
	function handleSelect(roleIndex: number) {
		return () => {
			setSelectedRole(roleIndex);
			setDropdown(false);
		};
	}
	return (
		<div className="w-full h-[100vh] flex justify-center items-center">
			<form
				className="p-8 flex flex-col gap-5 justify-center items-center w-[500px] max-h-[550px] min-h-[200px] rounded-2xl sign-in-form relative"
				onSubmit={(e) => {
					const user = DEMO_USER_CREDENTIALS[selectedRole];
					handleSubmit(
						e,
						{
							phoneNo: user.phoneNo,
							password: user.password,
						},
						searchParams?.callbackUrl
					);
				}}
			>
				{!!searchParams?.error && (
					<h1 className="absolute top-0 p-4 w-full text-center bg-red-200 rounded-t-2xl text-red-800">
						Authentication Failed
					</h1>
				)}
				<div className="h-[80%] w-full flex flex-col items-center pt-5 gap-5">
					<h1 className="text-3xl font-bold mb-5">Sign In As</h1>
					<div className="flex flex-col items-center justify-center h-full w-full gap-4">
						<RoleCard
							role={DEMO_USER_CREDENTIALS[selectedRole]}
							handleClick={() =>
								setDropdown((dropdown) => !dropdown)
							}
						/>
						{dropdown && (
							<RoleList
								selected={selectedRole}
								handleSelect={handleSelect}
							/>
						)}
					</div>
				</div>
				<button className="mt-6 px-4 py-3 mb-2 rounded-md bg-blue-700 text-white w-[80%] mx-2">
					Log in
				</button>
			</form>
		</div>
	);
}
async function handleSubmit(
	e: React.FormEvent<HTMLFormElement>,
	data: { phoneNo: string; password: string },
	callbackUrl?: string
) {
	e.preventDefault();
	await signIn("credentials", {
		phoneNo: data.phoneNo,
		password: data.password,
		redirect: true,
		callbackUrl: callbackUrl ?? "/",
	});
}

const RoleCard = ({
	role,
	handleClick,
	showCaret = true,
}: {
	role: demoRole;
	handleClick: MouseEventHandler<HTMLDivElement>;
	showCaret?: boolean;
}) => {
	return (
		<div
			className={`rounded-md p-5 ${
				showCaret ? "bg-blue-50" : "bg-gray-100"
			} flex gap-4 w-[80%] items-center justify-between cursor-pointer`}
			onClick={handleClick}
		>
			<div className="flex gap-4">
				<Image
					src={role.icon}
					alt={`${role.role} icon`}
					width={25}
					height={25}
				/>
				<h2 className="text-xl">{role.role}</h2>
			</div>
			{showCaret && (
				<FontAwesomeIcon icon={faCaretDown} width={25} height={25} />
			)}
		</div>
	);
};

const RoleList = ({
	selected,
	handleSelect,
}: {
	selected: number;
	handleSelect: (roleIndex: number) => () => void;
}) => {
	// const roleList = DEMO_USER_CREDENTIALS.reduce((acc, cur, ind) => {
	// 	if (ind != selected) {
	// 		return [
	// 			...acc,
	// 			<RoleCard role={cur} handleClick={() => {}} key={ind} />,
	// 		];
	// 	}
	// 	return acc;
	// }, []);
	const roleList = DEMO_USER_CREDENTIALS.filter(
		(role) => role.id !== selected
	);
	return (
		<div className="w-full flex flex-col items-center relative gap-2 p-2">
			{roleList.map((role) => (
				<RoleCard
					role={role}
					handleClick={handleSelect(role.id)}
					key={role.id}
					showCaret={false}
				/>
			))}
		</div>
	);
};
