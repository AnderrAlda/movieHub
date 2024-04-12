import app from "./server";
import config from "./config/config";
import prisma from "./db/client";

const PORT = config.app.PORT;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await prisma.$connect();
  console.log("Prisma connected");
});
