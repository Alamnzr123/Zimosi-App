import { Users, IUser } from '../helper/config.ts';
import { Request, Response, NextFunction } from 'express';

type ParamsWithId = { UsersId?: string };

const ControllerUsers = {

    getAll: async function (req: Request, res: Response, next: NextFunction) {
        try {
            const docs = await Users.find().exec() as IUser[];
            const data = docs.map(d => d.toObject());
            res.status(200).json(data);
        } catch (err) {
            next(err)
        }
    },

    getOne: async function (req: Request<ParamsWithId>, res: Response, next: NextFunction) {
        try {
            const { UsersId } = req.params;

            const doc = await Users.findOne({ id: UsersId }).exec() as IUser | null;
            const data = doc ? doc.toObject() : null;
            res.status(200).json(data);

        } catch (err) {
            next(err);
        }
    },

    update: async function (req: Request<ParamsWithId>, res: Response, next: NextFunction) {
        try {
            const { UsersId } = req.params;

            const data = await Users.findOneAndUpdate({ id: UsersId } as any,
                { Name: req.body.Name });
            res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    },

    delete: async function (req: Request<ParamsWithId>, res: Response, next: NextFunction) {
        try {
            const { UsersId } = req.params;

            const data = await Users.deleteOne({ id: UsersId } as any);
            res.status(200).json({ message: "Data deleted", data });

        } catch (err) {
            next(err);
        }
    }
}

export default ControllerUsers;