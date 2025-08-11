import { v4 } from 'uuid';

type toastType = 'Success' | 'Warning' | 'Error' | 'Info';

type ToastMessage = {
	id: string;
	message: string;
	toastType: toastType;
};

class ToastClass {
	values: ToastMessage[] = $state([]);

	create(message: string, type: toastType = 'Info', timeout: number = 3000) {
		const id = v4();
		const newToast = { id: id, message: message, toastType: type };
		this.values.push(newToast);

		setTimeout(() => {
			this.removeByID(id);
		}, timeout);
	}

	removeByID(id: string) {
		const ToastMessage = this.values.find((toastMessage) => toastMessage.id === id);
		if (ToastMessage !== undefined) {
			const index = this.values.indexOf(ToastMessage);
			this.values.splice(index, 1);
		}
	}

	clear() {
		this.values = [];
	}
}

export const Toast = new ToastClass();
