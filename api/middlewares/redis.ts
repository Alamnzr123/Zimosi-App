import client from '../helper/config_redis.js';
import { Request, Response, NextFunction } from 'express';

const hitProductAll = async (req: Request, res: Response, next: NextFunction) => {
    const idUser = req.params.id;
    let result;
    try {
        const product = await client.get(`cache/${idUser}`);
        console.log(product);
        if (product) {
            result = JSON.parse(product);
            res.send({
                fromCache: true,
                data: result
            })
        } else {
            next();
        }
    }
    catch (err) {
        console.error(err);
        res.status(404);
    }
}

export {
    hitProductAll
}