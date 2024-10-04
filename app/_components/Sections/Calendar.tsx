"use client";
import moment from "moment";
import { useState } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import withDragandDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { useConfirm } from "../../_hooks/useConfirm";
import { useCalendar } from "../../_hooks/useCalendar";
import ReceptionistAppointmentForm from "../Forms/ReceptionistAppointmentForm";
import { useRouter } from "next/navigation";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Warning from "../Popups/Warning";

const DnDCalendar = withDragandDrop<event>(BigCalendar);
export type event = {
	start: Date;
	end: Date;
	title: string;
	resourceId?: string;
	data: { id: string; patientId?: string };
};
export type resource = {
	id: string;
	title: string;
	deptId: string;
};
type props = {
	resources: resource[];
	initialEvents: event[];
	fullWidth?: boolean;
};

const Calendar = ({ resources, initialEvents, fullWidth }: props) => {
	const localizer = momentLocalizer(moment);
	const { open, handleConfirm, handleCancel, confirm } = useConfirm();
	const [popup, setPopup] = useState<boolean>(false);
	const [events, setEvents] = useState<event[]>(initialEvents);
	const router = useRouter();

	const { message, currentEvent, handleDrop } = useCalendar(
		setEvents,
		resources,
		confirm
	);

	return (
		<div
			className={`h-full ${
				fullWidth ? "w-full" : "w-5/6"
			} flex justify-center`}
		>
			<Warning
				handleCancel={handleCancel}
				handleConfirm={handleConfirm}
				isOpen={open}
			>
				{message.current}
			</Warning>
			<ReceptionistAppointmentForm
				setEvents={setEvents}
				popup={popup}
				setPopup={setPopup}
			/>

			<DnDCalendar
				localizer={localizer}
				events={events}
				resources={resources}
				views={["day", "week", "agenda"]}
				defaultView="day"
				onEventDrop={handleDrop}
				resizable={false}
				onSelectSlot={() => setPopup(true)}
				onSelectEvent={(event: event) => {
					if (event.data.patientId) {
						const searchParams = new URLSearchParams({
							appId: event.data.id,
						});
						router.push(
							`${process.env.NEXT_PUBLIC_BASE_URL}/patients/${
								event.data.patientId
							}?${searchParams.toString()}`
						);
					}
				}}
				selectable={true}
				onDragStart={({ event }) => {
					currentEvent.current = event;
				}}
				style={{ width: "100%" }}
				min={moment("2024-02-04T08:00:00").toDate()}
				max={moment("2024-02-04T18:00:00").toDate()}
			/>
		</div>
	);
};

export default Calendar;
