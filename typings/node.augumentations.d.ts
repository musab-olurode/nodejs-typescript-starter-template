declare namespace NodeJS {
	interface ProcessEnv {
		APP_NAME: string;
		NODE_ENV: 'development' | 'production';
		APP_DEBUG: boolean;
		PORT: number;
		MONGO_URI: string;
		JWT_SECRET: string;
		JWT_EXPIRE: string;
		JWT_COOKIE_EXPIRE: string;
		CLIENT_URL: string;
		LIVE_CLIENT_URL: string;
		FILE_UPLOAD_PATH: string;
		SMTP_HOST: string;
		SMTP_PORT: string;
		SMTP_EMAIL: string;
		SMTP_PASSWORD: string;
		MAIL_FROM_EMAIL: string;
		MAIL_FROM_NAME: string;
		AWS_ACCESS_KEY_ID: string;
		AWS_SECRET_ACCESS_KEY: string;
		AWS_DEFAULT_REGION: string;
		AWS_BUCKET: string;
		PUSHER_APP_ID: number;
		PUSHER_APP_KEY: string;
		PUSHER_APP_SECRET: string;
		PUSHER_APP_CLUSTER: string;
		MIX_PUSHER_APP_KEY: string;
		MIX_PUSHER_APP_CLUSTER: string;
		PAYSTACK_KEY: string;
		AFT_USER_NAME: string;
		AFT_API_KEY: string;
		AFT_TR_SENDER_ID: string;
		LIVE_WALLET_SECRET: string;
		LIVE_WALLET_USER_ID: string;
		LIVE_WALLET_TOKEN: string;
		LIVE_WALLET_PUBLIC_KEY: string;
		LIVE_WALLET_PHONE: string;
		LIVE_WALLET_PHONE_PIN: string;
		LIVE_WALLET_PHONE_FIRST_NAME: string;
		LIVE_WALLET_PHONE_LAST_NAME: string;
		LIVE_WALLET_PHONE_NAME: string;
		TEST_WALLET_SECRET: string;
		TEST_WALLET_USER_ID: string;
		TEST_WALLET_PUBLIC_KEY: string;
		TEST_WALLET_TOKEN: string;
		GOOGLE_MAPS_API_KEY: string;
		TWILIO_ACCOUNT_SID: string;
		TWILIO_AUTH_TOKEN: string;
		TWILIO_VERIFICATION_SID: string;
		TWILIO_PHONE_NUMBER: string;
		FIREBASE_SERVER_KEY: string;
		LOG_SLACK_WEBHOOK_URL: string;
		ALGOLIA_APP_ID: string;
		ALGOLIA_SECRET: string;
		INFOBIP_API_KEY: string;
		INFOBIP_URL_BASE_PATH: string;
	}
}