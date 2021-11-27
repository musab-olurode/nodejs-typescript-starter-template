import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';
import IPagination from '../../interfaces/Pagination';

const advancedResults = (req: Request, res: Response, next: NextFunction) => {
	res.advancedResults = async (model: Model<any>, populate?: string) => {
		let query;

		const reqQuery = { ...(req.query as any) };

		// Fields to exclude
		const removeFields = ['select', 'sort', 'page', 'limit', 'exists'];

		// Loop over removeFields and delete them from reqQuery
		removeFields.forEach((param) => delete reqQuery[param]);

		// Check Existence
		if (req.query.exists) {
			const exists =
				(req.query.exists as string).split(',').length > 0
					? (req.query.exists as string).split(',')
					: [req.query.exists];

			(exists as string[]).map((val) => {
				reqQuery[val] = { $exists: true, $nin: [null, undefined] };
			});
		}

		// Evaluate NOT Operator
		// if (req.query.not) {
		//   const not =
		//     req.query.not.split(',').length > 0
		//       ? req.query.not.split(',')
		//       : [req.query.not];
		//   reqQuery[not[0]] = { $not: { $regex: '^h.*' } };
		// }

		// Create query string
		let queryStr = JSON.stringify(reqQuery);

		// Create operators ($gt, $gte, etc)
		queryStr = queryStr.replace(
			/\b(gt|gte|lt|lte|in)\b/g,
			(match) => `$${match}`
		);

		// Finding resource
		query = model.find(JSON.parse(queryStr)).sort({ createdAt: -1 });

		// Select Fields
		if (req.query.select) {
			const fields = (req.query.select as string).split(',').join(' ');
			query = query.select(fields);
		}

		// Sort
		if (req.query.sort) {
			const sortBy = (req.query.sort as string).split(',').join(' ');
			query = query.sort(sortBy);
		} else {
			query = query.sort('-createdAt');
		}

		// Pagination
		const page = parseInt(req.query.page as string, 10) || 1;
		const limit = parseInt(req.query.limit as string, 10) || 25;
		const startIndex = (page - 1) * limit;
		const endIndex = page * limit;
		const total = await model.countDocuments();

		query = query.skip(startIndex).limit(limit);

		if (populate) {
			query = query.populate(populate);
		}

		// Executing query
		const results = await query;

		// Pagination result
		const pagination: IPagination = { current: page, limit, total };

		if (endIndex < total) {
			pagination.next = {
				page: page + 1,
				limit,
				total,
			};
		}

		if (startIndex > 0) {
			pagination.prev = {
				page: page - 1,
				limit,
				total,
			};
		}

		return res.status(200).json({
			success: true,
			message: 'records retrieved',
			data: results,
			count: results.length,
			pagination,
		});
	};
	next();
};

export default advancedResults;
