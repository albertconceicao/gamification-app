import cors from 'cors';

// CORS configuration
export const corsOptions = {
	origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
		// Allow requests with no origin (like mobile apps, Postman, or curl requests)
		if (!origin) return callback(null, true);
		
		// In development, allow all localhost origins
		if (process.env.NODE_ENV !== 'production') {
			return callback(null, true);
		}
		
		// In production, only allow specific origins
		const allowedOrigins = process.env.FRONTEND_URL 
			? [process.env.FRONTEND_URL]
			: ['http://localhost:5173'];
		
		if (allowedOrigins.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
	credentials: true,
	optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Export the CORS middleware
export const corsMiddleware = cors(corsOptions);