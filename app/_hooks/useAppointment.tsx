import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { patientAppointment } from "../utils/db/appointment";

export function useAppointment(
	initialAppointments: patientAppointment[]
): [patientAppointment[], Dispatch<SetStateAction<patientAppointment[]>>] {
	const [appointment, setAppointment] =
		useState<patientAppointment[]>(initialAppointments);
	useEffect(() => {
		setAppointment(initialAppointments);
	}, [initialAppointments]);
	return [appointment, setAppointment];
}
