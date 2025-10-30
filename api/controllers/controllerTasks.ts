import { Notification, Tasks, TasksHistory, TasksComment, UserTasks, Users, ITask, IUser } from '../helper/config.js';

import { Queue, Worker, QueueEvents } from "bullmq";
import jwt from "jsonwebtoken";
import Role from "../helper/role.js";
import config from "../helper/secret_key.js";
import client from '../helper/config_redis.js';
import { Request, Response, NextFunction } from 'express';

const ControllerOperator = {

    listen: async function (req: Request, res: Response, next: NextFunction) {
        try {
            const queueEvents = new QueueEvents('Paint');

            queueEvents.on('completed', ({ jobId }: any) => {
                console.log('done painting');
                res.status(200).json({ message: "Listen" });
            });

            queueEvents.on('failed', (payload: any) => {
                const { jobId, failedReason } = payload as any;
                console.error('error painting', failedReason);
            });
        }
        catch (err) {
            next(err);
        }
    },

    authentication: async function (req: Request, res: Response, next: NextFunction) {
        try {
            const user = await Users.findOne({ Name: req.body.Name });
            console.log(user);

            if (user) {
                const token = jwt.sign({ id: user.UsersId, role: user.Roll } as any, config.secret as any, {
                    expiresIn: '7h',
                    algorithm: 'HS256',
                } as any);
                res.json({ user, message: "User logged in", token })
            } else {
                res.status(400).json({ message: "Username incorect" });
            }
        }
        catch (err) {
            next(err);
        }
    },

    getAllWithPaginationAndFilter: async function (req: Request, res: Response, next: NextFunction) {
        try {
            const { page, limit, status, dueDate } = req.query;
            const pageNum = Number(page) || 1;
            const limitNum = Number(limit) || 10;

            // Retrieve Mongoose documents and convert to plain objects before mutating
            const docs = await Tasks.find()
                .sort({ TasksDueDate: -1 })
                .limit(limitNum as any)
                .skip((pageNum - 1) * limitNum)
                .exec() as ITask[];
            const data3 = docs.map((doc) => {
                const item = doc.toObject() as unknown as ITask & { TasksDueDate?: any; TasksName?: any };
                if (item.TasksDueDate) item.TasksDueDate = new Date(item.TasksDueDate).toISOString().split('T')[0];
                if (status) item.TasksName = status as any;
                return item;
            });

            const total = await Tasks.countDocuments();
            console.log(total);

            const totalPages = Math.ceil(total / limitNum);

            res.status(200).json({
                data3,
                total,
                totalPages
            });

        } catch (err) {
            next(err);
        }
    },

    getAllHistory: async function (req: Request, res: Response, next: NextFunction) {
        try {

            const worker = new Worker('notification', async (job: any) => {
                if (job.name === 'newNotification') {
                    console.log("Notification from BullMQ");
                } else {
                    console.log("Notification Error");
                }
            }, {
                connection: client as any
            });

            worker.on('completed', (jobId: any, result: any) => {
                console.log(`Job ${jobId} completed with result ${result}`);
            });

            const currentUser = req.user as any;

                if (currentUser?.role !== Role.Admin) {
                    return res.status(401).json({ message: "Not Authorized!" });
                }

            const historyDocs = await TasksHistory.find().sort({ HistoryId: -1 }).exec();
            const data = historyDocs.map((d: any) => d.toObject());
            console.log(data);
            res.status(200).json({
                Message: data,
                Message2: worker.qualifiedName
            });
        } catch (err) {
            next(err);
        }
    },

    getAll: async function (req: Request, res: Response, next: NextFunction) {
        try {
            const currentUser = req.user as any;
            console.log(currentUser);

                if (currentUser?.role !== Role.Manager) {
                    return res.status(401).json({ message: "Not Authorized!" });
                }

            const docs = await Tasks.find().exec() as ITask[];
            const data = docs.map(d => d.toObject());
            res.status(200).json(data);
        } catch (err) {
            next(err)
        }
    },


    getOne: async function (req: Request, res: Response, next: NextFunction) {
        try {
            const currentUser = req.user as any;
            console.log(currentUser);

            if (currentUser?.role !== Role.Manager) {
                return res.status(401).json({ message: "Not Authorized!" });
            }

            const { id } = req.params;
            const doc = await Tasks.findOne({ TasksId: id }).exec() as ITask | null;
            const data = doc ? (doc.toObject() as any) : null;
            console.log(data);

            const redis = await client.set(`cache/${id}`, JSON.stringify(data), { EX: 10, NX: true } as any);
            console.log(redis);
            res.status(200).json({
                fromCache: false,
                data: redis
            });
        } catch (err) {
            next(err);
        }
    },

    create: async function (req: Request, res: Response, next: NextFunction) {
        try {

            const user = await Users.findOne({ Name: req.body.Name });
            const userID = await Users.findOne({ UsersId: req.body.UsersId });
            const taskId = await Tasks.findOne({ TasksId: req.body.TasksId });

            if (user || userID || taskId) {
                return res.status(400).json({ message: "User or User ID or Task ID already exists" });
            }
            else {
                const { UsersId, Name, Roll, Birthday, TasksId, TasksName, TasksDescription, TasksStatus, TasksDueDate } = req.body;

                const newUsers = new Users();
                newUsers.UsersId = UsersId;
                newUsers.Name = Name;
                newUsers.Roll = Roll;
                newUsers.Birthday = Birthday;
                newUsers.save();

                const newTasks = new Tasks();
                newTasks.TasksId = TasksId;
                newTasks.TasksName = TasksName;
                newTasks.TasksDescription = TasksDescription;
                newTasks.TasksStatus = TasksStatus;
                newTasks.TasksDueDate = TasksDueDate;
                newTasks.save();

                const newTasksHistory = new TasksHistory();
                newTasksHistory.HistoryId = TasksId;
                newTasksHistory.HistoryName = newTasks;
                newTasksHistory.HistoryDescription = TasksDescription;
                newTasksHistory.save();

                const newTasksComment = new TasksComment();
                newTasksComment.CommentId = TasksId;
                newTasksComment.CommentName = newTasks;
                newTasksComment.CommentDescription = TasksDescription;
                newTasksComment.save();

                const newUserTasks = new UserTasks();
                newUserTasks.UserTasksId = UsersId;
                newUserTasks.UserTasksName = newUsers;
                newUserTasks.save();

                function notificationTask() {
                    const newNotification = new Notification();
                    newNotification.NotificationId = TasksId;
                    newNotification.NotificationName = newTasks;
                    newNotification.NotificationDescription = TasksDescription;
                    newNotification.save();
                }

                const limiter = new Queue("notification") as any;
                await limiter.add('newNotification', {
                    data: notificationTask()
                })

                limiter.on('progress', (jobId: any, progress: any) => {
                    console.log(`Job ${jobId} progress with result ${progress}`);
                });


                res.status(201).json({ message: "Data inserted" });
            }
        } catch (err) {
            next(err);
        }
    },


    update: async function (req: Request, res: Response, next: NextFunction) {
        try {
            const currentUser = req.user;
            console.log(currentUser);

            if (currentUser?.role !== Role.Manager) {
                return res.status(401).json({ message: "Not Authorized!" });
            }

            const { id } = req.params;
            const data = await Tasks.findOneAndUpdate({ id: id } as any, {
                TasksName: req.body.TasksName,
                TasksDescription: req.body.TasksDescription,
                TasksStatus: req.body.TasksStatus,
                TasksDueDate: req.body.TasksDueDate
            });
            res.status(200).json(data);

        } catch (error) {
            next(error);
        }
    },

    delete: async function (req: Request, res: Response, next: NextFunction) {
        try {

            const currentUser = req.user;
            console.log(currentUser);


            if (currentUser?.role !== Role.Manager) {
                return res.status(401).json({ message: "Not Authorized!" });
            }

            const { id } = req.params;

            const data = await Tasks.deleteOne({ TasksId: id });
            res.status(200).json({ message: "Data deleted", data });

        } catch (err) {
            next(err);
        }
    }
}

export default ControllerOperator;