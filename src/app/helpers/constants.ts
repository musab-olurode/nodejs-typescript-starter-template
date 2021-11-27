const enum UserType {
	Admin = 'Admin',
	User = 'User',
}

const enum UtilityBill {
	Nepa = 'Nepa',
	Water = 'Water',
}

const enum EmploymentStatus {
	Employed = 'Employed',
	SelfEmployed = 'SelfEmployed',
	Unemployed = 'Unemployed',
}

const formatPhone = (phone: string) => {
	return phone.startsWith('+234') ? phone : '+234' + phone.substring(1);
};

const unformatPhone = (phone: string) => {
	return phone.startsWith('+234') ? '0' + phone.substring(4) : phone;
};

const generateString = (
	length: number,
	useAlphabeticCharacters: boolean = true,
	useNumericCharacters: boolean = true
) => {
	var result = '';
	var characters = '';
	if (useAlphabeticCharacters) {
		characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	}
	if (useNumericCharacters) {
		characters = characters + '0123456789';
	}
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
};

const numberWithCommas = (number: string) => {
	const amount = parseFloat(number).toFixed(2);
	return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const numberWithNaira = (value: string) => '₦' + numberWithCommas(value);

export {
	UserType,
	UtilityBill,
	EmploymentStatus,
	formatPhone,
	unformatPhone,
	generateString,
	numberWithCommas,
	numberWithNaira,
};
