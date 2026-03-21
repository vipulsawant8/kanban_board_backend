import './loadEnv.js';

import app from './app.js';
import connectDB from './db/connectDB.js';
import logger from './utils/logger.js';

let server; // 👈 important

const initiateServer = async () => {
	try {
		logger.info("Server initialization started");
		
		await connectDB();
		logger.info("Database connected successfully");

		const PORT = process.env.PORT;

		server = app.listen(PORT, () => {
			logger.info({ port: PORT }, "Server running successfully");
		});

	} catch (error) {
		logger.fatal({ err: error }, "Server failed to start");
		process.exit(1);	
	}
};

initiateServer();

let isShuttingDown = false;

const shutdown = async (signal) => {
	if (isShuttingDown) return;   // 👈 first line
	isShuttingDown = true;        // 👈 immediately set

	logger.warn(`${signal} received. Shutting down gracefully...`);

	try {
		if (server) {
			await new Promise((resolve, reject) => {
				server.close((err) => err ? reject(err) : resolve());
			});
			logger.info("HTTP server closed");
		}

		const mongoose = await import("mongoose");
		await mongoose.default.connection.close();
		logger.info("MongoDB connection closed");

		process.exit(0);

	} catch (err) {
		logger.error({ err }, "Error during shutdown");
		process.exit(1);
	}
};

// Handle signals
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);