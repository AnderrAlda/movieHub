import dotenv from "dotenv";

type Tconfig = {
  [key: string]: EnviromentConfig;
};

type EnviromentConfig = {
  app: AppConfig;
  db: DbConfig;
};

type AppConfig = {
  PORT: string | number;
};

type DbConfig = {
  URI: string;
};

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
} else {
  dotenv.config({ path: ".env.development" });
}

const ENV = process.env.NODE_ENV ?? "development";

const CONFIG: Tconfig = {
  development: {
    app: {
      PORT: process.env.PORT || 4001,
    },
    db: {
      URI: process.env.MONGODB_URI || "mongodb://localhost:27017",
    },
  },
  production: {
    app: {
      PORT: process.env.PORT || 8081,
    },
    db: {
      URI: process.env.MONGODB_URI || "mongodb://localhost:27017",
    },
  },
};

export default CONFIG[ENV];
