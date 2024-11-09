import { options } from "@/app/api/auth/[...nextauth]/options";
import { patientProfile } from "@/app/utils/db/patient";
import { getHeader } from "@/app/utils/header";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getServerSession } from "next-auth";
export default async function PatientProfile() {
	const user = await getServerSession(options);
	const {
		firstName,
		middleName,
		lastName,
		birthDate,
		sex,
		mobileNumber,
		occupation,
		patientRecord,
		email,
		city,
		kebele,
		region,
		woreda,
		emergencyContactMobileNo,
		emergencyContactName,
	}: patientProfile = await fetch(
		`${process.env.BASE_URL}/api/patient/${user?.user.id}`,
		{ headers: getHeader() }
	).then((res) => res.json());
	return (
		<main className="w-full mt-24 flex flex-col items-center gap-3 py-1 px-9 sm:px-5">
			<h1 className="text-2xl sm:text-4xl mb-5 w-full sm:w-3/4 text-left">
				My Profile
			</h1>
			<div className="flex w-full sm:w-3/4 flex-col gap-1 text-sm sm:text-lg break-words">
				<div className="flex">
					<p className="bg-slate-200 p-2 w-1/3 max-w-48 font-bold">
						FullName
					</p>
					<p className="p-2 w-3/5 max-w-96">{`${firstName} ${middleName} ${lastName}`}</p>
				</div>
				<div className="flex">
					<p className="bg-slate-200 p-2 w-1/3 max-w-48 font-bold">
						Age
					</p>
					<p className="p-2 w-3/5 max-w-96">
						{new Date().getFullYear() -
							new Date(birthDate).getFullYear()}
					</p>
				</div>
				<div className="flex">
					<p className="bg-slate-200 p-2 w-1/3 max-w-48 font-bold">
						Sex
					</p>
					<p className="p-2 w-3/5 max-w-96">{sex}</p>
				</div>
				<div className="flex">
					<p className="bg-slate-200 p-2 w-1/3 max-w-48 font-bold">
						Address
					</p>
					<p className="p-2 w-3/5 max-w-96">
						{woreda && (region || city)
							? `${city}, ${region} Woreda: ${woreda}`
							: "No Address Provided"}
					</p>
					<button>
						<FontAwesomeIcon icon={faEdit} />
					</button>
				</div>
				<div className="flex">
					<p className="bg-slate-200 p-2 w-1/3 max-w-48 font-bold">
						Mobile No.
					</p>
					<p className="p-2 w-3/5 max-w-96">{mobileNumber}</p>
					<button>
						<FontAwesomeIcon icon={faEdit} />
					</button>
				</div>
				<div className="flex">
					<p className="bg-slate-200 p-2 w-1/3 max-w-48 font-bold">
						Email
					</p>
					<p className="p-2 w-3/5 max-w-96 text-wrap ">
						{email || "No Email Provided"}
					</p>
					<button>
						<FontAwesomeIcon icon={faEdit} />
					</button>
				</div>
				<div className="flex">
					<p className="bg-slate-200 p-2 w-1/3 max-w-48 font-bold">
						Emergency Contact Name
					</p>
					<p className="p-2 w-3/5 max-w-96">
						{emergencyContactName || "Not Provided"}
					</p>
					<button>
						<FontAwesomeIcon icon={faEdit} />
					</button>
				</div>
				<div className="flex">
					<p className="bg-slate-200 p-2 w-1/3 max-w-48 font-bold">
						Emergency Contact Phone
					</p>
					<p className="p-2 w-3/5 max-w-96">
						{emergencyContactMobileNo || "Not Provided"}
					</p>
					<button>
						<FontAwesomeIcon icon={faEdit} />
					</button>
				</div>
				<div className="flex">
					<p className="bg-slate-200 p-2 w-1/3 max-w-48 font-bold">
						Occupation
					</p>
					<p className="p-2 w-3/5 max-w-96">
						{occupation || "Not Provided"}
					</p>
					<button>
						<FontAwesomeIcon icon={faEdit} />
					</button>
				</div>
				<div className="flex">
					<p className="bg-slate-200 p-2 w-1/3 max-w-48 font-bold">
						Blood Type
					</p>

					<p className="p-2 w-3/5 max-w-96">
						{patientRecord?.bloodType || "Unknown"}
					</p>
				</div>
			</div>
		</main>
	);
}
