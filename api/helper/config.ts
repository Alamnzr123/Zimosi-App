import mongoose, { Document, Schema, Model } from 'mongoose';

// Define interfaces for documents
export interface IUser extends Document {
  UsersId: number;
  Name: string;
  Roll: string;
  Birthday?: Date;
  Address?: string;
}

export interface ITask extends Document {
  TasksId: number;
  TasksName: string;
  TasksDescription?: string;
  TasksStatus?: string;
  TasksDueDate?: Date;
}

export interface ITasksHistory extends Document {
  HistoryId: number;
  HistoryName?: any;
  HistoryDescription?: string;
}

export interface ITasksComment extends Document {
  CommentId: number;
  CommentName?: any;
  CommentDescription?: string;
}

export interface INotification extends Document {
  NotificationId: number;
  NotificationName?: any;
  NotificationDescription?: string;
}

export interface IUserTasks extends Document {
  UserTasksId: number;
  UserTasksName?: any;
}

const UsersSchema = new Schema<IUser>({
  UsersId: Number,
  Name: String,
  Roll: String,
  Birthday: Date,
  Address: String,
});

const TasksSchema = new Schema<ITask>({
  TasksId: Number,
  TasksName: String,
  TasksDescription: String,
  TasksStatus: String,
  TasksDueDate: Date,
});

const TasksHistorySchema = new Schema<ITasksHistory>({
  HistoryId: Number,
  HistoryName: Schema.Types.Mixed,
  HistoryDescription: String,
});

const TasksCommentSchema = new Schema<ITasksComment>({
  CommentId: Number,
  CommentName: Schema.Types.Mixed,
  CommentDescription: String,
});

const NotificationSchema = new Schema<INotification>({
  NotificationId: Number,
  NotificationName: Schema.Types.Mixed,
  NotificationDescription: String,
});

const UserTasksSchema = new Schema<IUserTasks>({
  UserTasksId: Number,
  UserTasksName: Schema.Types.Mixed,
});

const Users: Model<IUser> = mongoose.model<IUser>('users', UsersSchema);
const Tasks: Model<ITask> = mongoose.model<ITask>('tasks', TasksSchema);
const TasksHistory: Model<ITasksHistory> = mongoose.model<ITasksHistory>('tasks_history', TasksHistorySchema);
const TasksComment: Model<ITasksComment> = mongoose.model<ITasksComment>('tasks_comment', TasksCommentSchema);
const Notification: Model<INotification> = mongoose.model<INotification>('notification', NotificationSchema);
const UserTasks: Model<IUserTasks> = mongoose.model<IUserTasks>('user_tasks', UserTasksSchema);

export {
  Users,
  Tasks,
  TasksHistory,
  TasksComment,
  Notification,
  UserTasks,
};