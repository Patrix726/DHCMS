"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Popup from "./Popup";
import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import Button, { variants } from "../Buttons/Button";
import { MouseEventHandler } from "react";

type props = {
	isOpen: boolean;
	handleClick?: MouseEventHandler<HTMLButtonElement>;
	buttonLabel?: string;
	children: any;
};

const ErrorPopup = ({
	isOpen,
	handleClick,
	buttonLabel = "Close",
	children,
}: props) => {
	return (
		<Popup isOpen={isOpen}>
			<div className="flex flex-col p-10 m-auto absolute inset-0 bg-white items-center justify-around gap-5 text-center">
				<FontAwesomeIcon
					icon={faXmarkCircle}
					className="text-7xl text-red-600"
				/>
				{children}
				<Button
					onClick={handleClick}
					label={buttonLabel}
					variant={variants.Error}
				/>
			</div>
		</Popup>
	);
};

export default ErrorPopup;
