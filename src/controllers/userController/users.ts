import { PrismaClient, UserRole } from ".prisma/client";

const prisma = new PrismaClient();

export class User {
  signupAdmin = async (
    userIdentifier: string,
    firstName: string,
    lastName: string,
    password: string,
    dateOfBirth: Date,
    hireDate: Date,
    idCardNumber: string,
    email: string,
    role: UserRole = "ADMIN_SYSTEM",
    shopIdentifier: string
  ) => {
    const result = await prisma.user.create({
      data: {
        userIdentifier,
        firstName,
        lastName,
        password,
        dateOfBirth,
        hireDate,
        idCardNumber,
        email,
        role,
        shopIdentifier,
      },
    });
    return result;
  };
  findOneUser = async (email: string) => {
    const result = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return result;
  };
  findUsers = async () => {
    const users = await prisma.user.findMany({});
    return users;
  };
  findUserByUserIdentifier = async (userIdentifier: string) => {
    const result = await prisma.user.findUnique({
      where: {
        userIdentifier,
      },
    });
    return result;
  };
  attachShoptoUser = async (userIdentifier: string, shopIdentifier: string) => {
    const result = await prisma.user.update({
      where: {
        userIdentifier,
      },
      data: {
        shop: {
          connect: {
            shopIdentifier,
          },
        },
      },
    });
    return result;
  };
}
