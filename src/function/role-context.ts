import { Context } from '../context';

interface CreateRole {
  name: string;
}

export async function createRole(role: CreateRole, ctx: Context) {
  return await ctx.prisma.role.create({
    data: role,
  });
}

export async function findAll(ctx: Context) {
  return await ctx.prisma.role.findMany({});
}

export async function findOne(id: string, ctx: Context) {
  return await ctx.prisma.role.findUnique({
    where: {
      id,
    },
  });
}
