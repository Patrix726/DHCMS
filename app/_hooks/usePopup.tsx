import { useEffect, useRef } from "react";

export function usePopup(isOpen: boolean) {
	const modalRef = useRef<HTMLDialogElement | null>(null);

	useEffect(() => {
		const modalElement = modalRef.current;
		if (modalElement) {
			if (isOpen) {
				modalElement.showModal();
			} else {
				modalElement.close();
			}
		}
	}, [isOpen]);

	return modalRef;
}
