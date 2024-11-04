import Link from "next/link";
const AdminDashboard = () => {
	return (
		<main className="w-full pt-24 flex flex-col justify-center gap-5 py-4 px-10 box-border min-h-full">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<div className="flex w-full gap-5">
					<Link
						href="#"
						className="p-5 rounded-2xl flex flex-col bg-blue-700 text-white gap-4 w-full h-48"
					>
						<h1 className="text-lg h-1/3">Total number of staff</h1>
						<p className="text-5xl h-full">100</p>
					</Link>
				</div>
				<div className="flex w-full gap-5">
					<Link
						href="#"
						className="p-5 rounded-2xl flex flex-col bg-blue-700 text-white gap-4 w-full h-48"
					>
						<h1 className="text-lg h-1/3">Total unpaid payments</h1>
						<p className="text-5xl h-full">$1,000</p>
					</Link>
				</div>
				<div className="flex w-full gap-5">
					<Link
						href="#"
						className="p-5 rounded-2xl flex flex-col bg-blue-700 text-white gap-4 w-full h-48"
					>
						<h1 className="text-lg h-1/3">
							Payments in past month
						</h1>
						<p className="text-5xl h-full">$10,000</p>
					</Link>
				</div>
				<div className="flex w-full gap-5">
					<Link
						href="/appointments"
						className="p-5 rounded-2xl flex flex-col bg-blue-700 text-white gap-4 w-full h-48"
					>
						<h1 className="text-lg h-1/3">
							Total appointments in the past week
						</h1>
						<p className="text-5xl h-full">20</p>
					</Link>
				</div>
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
				<div className="border-2 border-blue-700 rounded-2xl flex flex-col w-full min-h-96 p-5 gap-5">
					<h1 className="text-2xl text-blue-700 font-bold">
						Staff list
					</h1>
					<div className="h-full flex flex-col gap-3">
						<div className="flex justify-center items-center h-full">
							<p className="text-2xl text-gray-400">
								No staff for now
							</p>
						</div>
					</div>
				</div>
				<div className="flex flex-col w-full gap-5">
					<div className="border-2 border-blue-700 rounded-2xl flex flex-col w-full min-h-96 p-5 gap-5 h-1/2">
						<h1 className="text-2xl text-blue-700 font-bold">
							Inventory List
						</h1>
						<div className="h-full flex flex-col gap-3">
							<div className="flex justify-center items-center h-full">
								<p className="text-2xl text-gray-400">
									No inventory as of now
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
};

export default AdminDashboard;
