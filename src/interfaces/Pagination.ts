export default interface IPagination {
	current: number;
	limit: number;
	total: number;
	next?: {
		page: number;
		limit: number;
		total: number;
	};
	prev?: {
		page: number;
		limit: number;
		total: number;
	};
}
