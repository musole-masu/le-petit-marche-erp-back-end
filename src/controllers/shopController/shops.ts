import { PrismaClient } from ".prisma/client";
import { Result } from "express-validator";

const prisma = new PrismaClient();

export class Shop {
  createShop = async (
    shopIdentifier: string,
    name: string,
    openDate: Date,
    description: string,
    location: string
  ) => {
    const result = await prisma.shop.create({
      data: {
        shopIdentifier,
        name,
        openDate,
        description,
        location,
      },
    });
    return result;
  };
  findShops = async (withUsers: boolean = false) => {
    const result = await prisma.shop.findMany({
      include: {
        users: withUsers,
      },
    });
    return result;
  };
  findShopsWithUser = async () => {
    const result = await prisma.shop.findMany({
      include: {
        users: true,
      },
    });
    return result;
  };
  findOneShop = async (shopIdentifier: string) => {
    const result = await prisma.shop.findUnique({
      where: {
        shopIdentifier,
      },
    });
    return result;
  };
  updateOneShop = async (shopIdentifier: string, data: {}) => {
    const result = await prisma.shop.update({
      where: {
        shopIdentifier,
      },
      data: {
        ...data,
      },
    });
    return result;
  };
}
