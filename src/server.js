import './loadEnv.js';

import app from './app.js';
import connectDB from './db/connectDB.js';
import logger from './utils/logger.js';

const initiateServer = async () => {
	
	try {
    	logger.info("Server initialization started");
		
		await connectDB();
    	logger.info("Database connected successfully");

		const PORT = process.env.PORT;
		await new Promise((resolve) => app.listen(PORT, resolve));
		logger.info({ port: PORT }, "Server running successfully");
	} catch (error) {
		
		logger.fatal({ err: error }, "Server failed to start");
    	process.exit(1);	
	}
};

initiateServer();

const shutdown = async (signal) => {
	logger.warn(`${signal} received. Shutting down gracefully...`);

	try {
		// Stop accepting new connections
		app.close(() => {
			logger.info("HTTP server closed");
		});

		// Close DB
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