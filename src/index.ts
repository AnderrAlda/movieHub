import app from "./server";
import config from "./config/config";
import connect from "./db/db";

const PORT = config.app.PORT;

//connect is to connect to the db
connect().then(() => {
  //listen the server in the port x. app is the server created in server.ts
  app.listen(PORT, () =>
    console.log(`Server is running on port ${PORT} and is connected to the db`)
  );
});
