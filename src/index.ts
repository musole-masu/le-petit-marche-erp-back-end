import { main, prisma, app } from "./app";

const start = async () => {
  // where the DB CONNECTION WILL INTERVENE
  main()
    .catch((e) => {
      throw e;
    })
    .finally(async () => {
      await prisma.$disconnect();
    });

  app.listen(4000, () => {
    return console.log(`server is listening on 4000`);
  });
};

start();
