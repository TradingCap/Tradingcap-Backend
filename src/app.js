// /* eslint-disable no-console */
// console
// RootPath = __dirname;
const express = require("express");
const app = express();
let path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const routers = require("./router");
const helmet = require('helmet');
const yup = require('yup');
// const rateLimit = require('express-rate-limit');
const {pageNotFoundHandler} = require('./middlewares/customHandlers');
const morgan = require("morgan");
const winston = require("winston");
const {createLogger, format, transports} = winston;

require('dotenv').config();
const {NODE_ENV, BASE_URL} = process.env;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

if (NODE_ENV === "production") {
    // Logging configuration
    const accessLogger = createLogger({
        level: "info",
        format: format.combine(format.timestamp(), format.json()),
        transports: [
            new transports.File({filename: "access.log", level: "info"}),
        ],
    });

    const errorLogger = createLogger({
        level: "error",
        format: format.combine(format.timestamp(), format.json()),
        transports: [
            new transports.File({filename: "error.log", level: "error"}),
        ],
    });

    // Create a stream for Morgan to pipe logs to Winston and encryption
    const morganStream = {
        write: (message) => {
            if (message.includes("error")) {
                // Log error messages to errorLogger
                errorLogger.error(message.trim());
            } else {
                // Log non-error messages to accessLogger
                accessLogger.info(message.trim());
            }
        },
    };

    //  use logger middleware
    // log all requests to access.log
    app.use(
        morgan("common", {
            stream: morganStream,
        })
    );
} else {
    app.use(morgan("dev"));
}

const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = ["http://localhost:3000", "https://trading-website-six.vercel.app", "www.tradingcaptech.com"]
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },    
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Date", "Content-Type", "Origin", "Authorization"],
    credentials: true,
    optionSuccessStatus: 200,
};
// enable cors
app.use(cors(corsOptions));
app.options('*', cors());
app.use(helmet());
app.use(helmet.xssFilter());
app.use("/api", routers);
app.use(express.static(path.join(__dirname, "public")));

app.use(pageNotFoundHandler);
app.use((error, req, res) => {
    if (error instanceof yup.ValidationError) {
        res.status(400).json({message: error.message})
        return
    }
    // Log the error
    console.log(error);
    res.status(500).json({message: 'An Error occured'})
})
module.exports = app;
