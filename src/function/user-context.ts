import { NotFoundException } from '@nestjs/common';
import { Context } from '../context';

interface CreateUser {
  name: string;
  lastName: string;
  email: string;
  password: string;
  displayName: string;
  refreshToken: string;
  city: string;
  isActive: boolean;
  phoneNumber: number;
  identificationCard: string;
}

export async function createUser(user: CreateUser, ctx: Context) {
  return await ctx.prisma.user.create({
    data: user,
  });
}

export async function getByEmail(email: string, ctx: Context) {
  const user = await ctx.prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    throw new NotFoundException();
  }

  return user;
}

export async function findAll(ctx: Context) {
  return await ctx.prisma.user.findMany({});
}

export async function findOne(id: string, ctx: Context) {
  return await ctx.prisma.user.findUnique({
    where: {
      id,
    },
  });
}
