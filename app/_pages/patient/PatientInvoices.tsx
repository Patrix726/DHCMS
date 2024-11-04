"use client";
import { invoices } from "@/app/utils/db/invoice";
import { Fragment, ReactElement } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReceipt } from "@fortawesome/free-solid-svg-icons";
import Button, { variants } from "@/app/_components/Buttons/Button";
type props = {
	dueInvoices: invoices[];
	paidInvoices: invoices[];
};
export default function PatientPayment({ dueInvoices, paidInvoices }: props) {
	return (
		<main className="w-full mt-24 flex flex-col items-center gap-3 py-1 px-5">
			<h1 className="text-2xl mb-5 w-full text-left sm:w-3/4 sm:text-4xl px-4 sm:px-0">
				Due Payment
			</h1>
			<DueInvoices data={separateInvoices(dueInvoices)} />
			<PaidInvoices paidInvoices={paidInvoices} />
		</main>
	);
}

const PaidInvoices = ({ paidInvoices }: { paidInvoices: invoices[] }) => {
	if (paidInvoices.length == 0) return;
	return (
		<div className="w-full sm:w-3/4 mb-10">
			<h1 className="text-2xl sm:text-4xl mb-5 w-full text-left bg-orange-200 p-5">
				Payment History
			</h1>
			{paidInvoices.map((invoice, ind) => {
				let title = "";
				if (invoice.services.length === 0) {
					title =
						invoice.Invoice_Medication.length === 1
							? `${invoice.Invoice_Medication[0].quantity} ${invoice.Invoice_Medication[0].medication.name} medication`
							: `${invoice.Invoice_Medication.length} medications`;
				} else if (invoice.services.length === 1) {
					title = invoice.services[0].name;
					title +=
						invoice.Invoice_Medication.length > 0
							? ` and ${invoice.Invoice_Medication.length} medications`
							: "";
				} else {
					title = `${invoice.services[0].name} and ${
						invoice.services.length - 1
					} other services`;
				}
				return (
					<div
						key={invoice.id}
						className="py-5 px-1 sm:px-8 md:px-10 lg:px-20 w-full flex justify-between text-xl items-center"
					>
						<div className="flex gap-6 items-center">
							<FontAwesomeIcon
								icon={faReceipt}
								className="text-4xl"
							/>
							<div className="flex flex-col">
								<h1 className="font-bold">{title}</h1>
								<span className="text-sm text-gray-800">
									{invoice.createdAt.toString().split("T")[0]}
								</span>
							</div>
						</div>
						<span className="font-bold text-2xl">
							$
							{invoice.services.reduce(
								(prev, cur) => prev + cur.price,
								0
							) +
								invoice.Invoice_Medication.reduce(
									(prev, cur) =>
										prev +
										cur.quantity * cur.medication.price,
									0
								)}
						</span>
					</div>
				);
			})}
		</div>
	);
};

type data = {
	data: {
		medications: (ReactElement | undefined)[];
		services: (ReactElement | undefined)[];
		medicationTotal: number;
		serviceTotal: number;
	};
};
const DueInvoices = ({ data }: data) => {
	const { services, medications, serviceTotal, medicationTotal } = data;
	return (
		<div className="w-full flex flex-col items-center gap-6 break-words">
			{services.length !== 0 && (
				<table className="w-full sm:w-3/4 text-sm sm:text-lg border border-blue-700">
					<thead>
						<tr className="text-sm sm:text-xl p-2 sm:p-14">
							<th className="text-left px-1 sm:px-3">Service</th>
							<th className="text-right px-1 sm:px-3">Date</th>
							<th className="text-right px-1 sm:px-3">
								Price{" "}
								<span className="text-xs font-normal">
									(in ETB)
								</span>
							</th>
						</tr>
					</thead>
					<tbody>{services}</tbody>
					<tfoot>
						<tr
							className="text-sm sm:text-xl font-bold"
							key={"total"}
						>
							<td colSpan={2} className="text-right px-1 sm:px-3">
								Total
							</td>
							<td className="text-right px-1 sm:px-3">
								{serviceTotal}
							</td>
						</tr>
					</tfoot>
				</table>
			)}
			{medications.length !== 0 && (
				<table className="w-full sm:w-3/4  text-sm sm:text-lg border border-blue-700">
					<thead>
						<tr className="text-sm sm:text-xl p-0 sm:p-14">
							<th className="text-left">Medication</th>
							<th className="text-right px-1 sm:px-3">
								Quantity
							</th>
							<th className="text-right px-1 sm:px-3">
								Date Prescribed
							</th>
							<th className="text-center px-1 sm:px-3">
								Price{" "}
								<span className="text-xs font-normal">
									(in ETB)
								</span>
							</th>
						</tr>
					</thead>
					<tbody>{medications}</tbody>
					<tfoot>
						<tr className="text-lg sm:text-xl font-bold">
							<td colSpan={3} className="text-right px-1 sm:px-3">
								Total
							</td>
							<td className="text-right px-1 sm:px-3">
								{medicationTotal}
							</td>
						</tr>
					</tfoot>
				</table>
			)}
			{services.length === 0 && medications.length === 0 ? (
				<div className="h-[70vh] w-full flex justify-center items-center text-xl text-gray-600">
					<p className="text-center">
						You are caught up with your fees
					</p>
				</div>
			) : (
				<div className="mt-8 w-full sm:w-3/4 flex justify-end mr-2">
					<Button label="Submit Payment" variant={variants.Primary} />
				</div>
			)}
		</div>
	);
};

function separateInvoices(invoices: invoices[]) {
	let serviceTotal = 0;
	const services = invoices.map((invoice, i): ReactElement | undefined => {
		return (
			<Fragment key={invoice.id}>
				{invoice.services.map((service, ind) => {
					serviceTotal += service.price;
					return (
						<tr key={service.id}>
							<td className="w-3/5 px-1 sm:px-3">
								{service.name}
							</td>
							<td className="text-right px-1 sm:px-3">
								{invoice.createdAt.toString().split("T")[0]}
							</td>
							<td className="text-right px-1 sm:px-3">
								{service.price}
							</td>
						</tr>
					);
				})}
			</Fragment>
		);
	});
	let medicationTotal = 0;
	const medications = invoices.map((invoice, i): ReactElement | undefined => {
		return (
			<Fragment key={invoice.id}>
				{invoice.Invoice_Medication.map((inv, ind) => {
					medicationTotal += inv.quantity * inv.medication.price;
					return (
						<tr key={inv.id}>
							<td className="w-3/5 px-1 sm:px-3 ">
								{inv.medication.name}
							</td>
							<td className="text-right px-1 sm:px-3">
								{inv.quantity}
							</td>
							<td className="text-right px-1 sm:px-3">
								{invoice.createdAt.toString().split("T")[0]}
							</td>
							<td className="text-right px-1 sm:px-3">
								{inv.medication.price}
							</td>
						</tr>
					);
				})}
			</Fragment>
		);
	});
	return { medications, services, medicationTotal, serviceTotal };
}
