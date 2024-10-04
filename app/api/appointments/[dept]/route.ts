import {
	scheduleAppointment,
	updateAppointment,
} from "@/app/utils/db/appointment";
import { NextRequest, NextResponse } from "next/server";
import {
	availableDoctor,
	getAvailableDoctor,
	getAvailableDoctors,
	getDoctor,
} from "@/app/utils/db/doctor";

export async function GET(
	req: NextRequest,
	{ params }: { params: { dept: string } }
) {
	const date = req.nextUrl.searchParams.get("date") as string;
	const startTime = new Date(date);
	const endTime = new Date(date);
	startTime.setHours(9);
	endTime.setHours(17);

	const departmentId = params.dept;
	const doctors = await getAvailableDoctors({
		startTime,
		endTime,
		departmentId,
	});

	const availableTimeSlots = filterTimeSlots(doctors);

	return NextResponse.json(availableTimeSlots);
}

export async function POST(
	req: NextRequest,
	{ params }: { params: { dept: string } }
) {
	const data: { date: string; patientId: string } = await req.json();
	const date = new Date(data.date);

	const doctor = await getAvailableDoctor({
		date,
		departmentId: params.dept,
	});

	if (doctor) {
		const appointment = await scheduleAppointment({
			date,
			doctorId: doctor[0].id,
			patientId: data.patientId,
		});

		return NextResponse.json(appointment);
	} else {
		return NextResponse.json(
			{ error: "No available doctors found for the selected time." },
			{ status: 404 }
		);
	}
}
export async function PUT(
	req: NextRequest,
	{ params }: { params: { dept: string } }
) {
	const data: {
		date: string;
		appointmentId: string;
		doctorId: string;
	} = await req.json();
	const date = new Date(data.date);
	const doctor = await getDoctor(data.doctorId);
	if (!doctor) {
		return NextResponse.json({ message: "Invalid doctor id", error: true });
	}
	const appointment = await updateAppointment({
		date,
		appointmentId: data.appointmentId,
		doctorId: doctor.id,
	});

	return NextResponse.json(appointment);
}
function initializeSlots(): Record<string, number> {
	const slots: Record<string, number> = {};
	const startHour = 9; // 9:00 AM
	const endHour = 17; // 5:00 PM

	for (let hour = startHour; hour < endHour; hour++) {
		slots[`${padTime(hour)}:00`] = 0;
		slots[`${padTime(hour)}:30`] = 0;
	}

	return slots;
}

// Helper function to pad the time with leading zero if necessary
function padTime(time: number): string {
	return time.toString().padStart(2, "0");
}

function filterTimeSlots(doctors: availableDoctor[]) {
	const timeSlots = initializeSlots();
	doctors.forEach((doctor) => {
		doctor.appointments.forEach((app) => {
			const datetime = new Date(app.datetime);
			const timeString = `${padTime(datetime.getHours())}:${padTime(
				datetime.getMinutes()
			)}`;
			timeSlots[timeString] =
				timeSlots[timeString] !== undefined
					? timeSlots[timeString] - 1
					: 1;
			-1;
		});
		doctor.workingHours.forEach((wh) => {
			for (let i = wh.from; i < wh.to; i++) {
				const hour = padTime(i);

				timeSlots[`${hour}:00`] =
					timeSlots[`${hour}:00`] !== undefined
						? timeSlots[`${hour}:00`] + 1
						: 1;
				timeSlots[`${hour}:30`] =
					timeSlots[`${hour}:30`] !== undefined
						? timeSlots[`${hour}:30`] + 1
						: 1;
			}
		});
	});
	return timeSlots;
}
