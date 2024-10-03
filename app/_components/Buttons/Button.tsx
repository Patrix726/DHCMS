"use client";
import { MouseEventHandler } from "react";
import styles from "./Button.module.css";
export enum variants {
	Primary,
	Secondary,
	Accent,
	Error,
	Success,
}
type props = {
	variant: variants;
	label?: string;
	size?: "medium" | "large";
	type?: "submit" | "button";
	onClick?: MouseEventHandler<HTMLButtonElement>;
	children?: any;
	style?: string;
};
const Button = ({
	onClick,
	label,
	variant,
	size = "large",
	type = "button",
	style = "",
	children,
}: props) => {
	const classNames = {
		[variants.Primary]: styles.primary,
		[variants.Secondary]: styles.secondary,
		[variants.Accent]: styles.accent,
		[variants.Error]: styles.error,
		[variants.Success]: styles.success,
		medium: styles.medium,
		large: styles.large,
	};
	return (
		<button
			className={`${styles.button} ${classNames[variant]} ${classNames[size]} ${style}`}
			onClick={onClick}
			type={type}
		>
			{children || label}
		</button>
	);
};

export default Button;
