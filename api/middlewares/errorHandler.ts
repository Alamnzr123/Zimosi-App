import { Request, Response, NextFunction } from 'express';
import logger from '../helper/logger.ts';

function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    const id = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    let status = 500;
    let message: any = 'Internal Server Error';

    switch (err.name) {
        case 'ValidationError':
            status = 400;
            message = err.errors?.map((el: any) => el.message) || err.message;
            break;
        case 'ConstraintError':
            status = 400;
            message = err.errors?.map((el: any) => el.message) || err.message;
            break;
        case 'EmptyResultError':
            status = 404;
            message = 'Data not found';
            break;
        case 'ConnectionError':
            status = 500;
            message = 'Database connection error';
            break;
        case 'DatabaseError':
            status = 500;
            message = 'Database error';
            break;
        case 'ForeignKeyConstraintError':
            status = 400;
            message = 'Foreign key constraint error';
            break;
        default:
            if (err.message) message = err.message;
    }

    const payload = {
        id,
        status,
        message,
        path: req.originalUrl,
        ts: new Date().toISOString(),
    };

    // Log full error with stack for investigation
    logger.error('Unhandled error', { ...payload, stack: err.stack });

    res.status(status).json(payload);
}

export default errorHandler;