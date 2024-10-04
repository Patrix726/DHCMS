import { faWarning } from "@fortawesome/free-solid-svg-icons";
import Button, { variants } from "../Buttons/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Popup from "./Popup";
import { MouseEventHandler } from "react";
type props = {
	isOpen: boolean;
	handleCancel: MouseEventHandler<HTMLButtonElement>;
	handleConfirm: MouseEventHandler<HTMLButtonElement>;
	children: any;
};
const Warning = ({ isOpen, handleCancel, handleConfirm, children }: props) => {
	return (
		<Popup isOpen={isOpen}>
			<div className="flex flex-col p-10 m-auto absolute inset-0 bg-white items-center justify-around gap-5 text-center">
				<FontAwesomeIcon
					icon={faWarning}
					className={`text-7xl text-orange-400`}
				/>
				<div className="text-gray-600 text-xl">{children}</div>
				<div className="flex w-full justify-end gap-2">
					<Button
						onClick={handleCancel}
						label="No"
						variant={variants.Secondary}
						size="large"
					/>

					<Button
						onClick={handleConfirm}
						label="Yes"
						variant={variants.Primary}
						size="large"
					/>
				</div>
			</div>
		</Popup>
	);
};

export default Warning;
