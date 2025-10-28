import express from 'express';
import logger from './helper/logger.ts';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './helper/swagger.ts';
const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
import path from "path";

import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import router from "./routes/index.ts";
import errorHandler from "./middlewares/errorHandler.ts";

// Hook morgan into winston so HTTP logs are structured
app.use(morgan('combined', { stream: { write: (msg: string) => logger.info(msg.trim()) } }));
app.use(cookieParser());
app.use(express.static(path.join(path.dirname("public"))));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(router);

// OpenAPI / Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

app.listen(port, () => {
    logger.info(`Server Running on Port ${port}`);
})

