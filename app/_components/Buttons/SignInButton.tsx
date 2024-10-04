"use client";
import { signIn } from "next-auth/react";
import React from "react";
import Button, { variants } from "./Button";

const SignInButton = () => {
	return (
		<Button
			label="Sign In"
			variant={variants.Primary}
			onClick={() => signIn()}
		/>
	);
};

export default SignInButton;
