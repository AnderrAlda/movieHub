import app from "./server";
import config from "./config/config";

const PORT = config.app.PORT;

//listen the server in the port x. app is the server created in server.ts
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
