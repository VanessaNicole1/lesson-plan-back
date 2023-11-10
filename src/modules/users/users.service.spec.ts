import { createUser, findAll, getByEmail } from '../../function/user-context';
import { Context, MockContext, createMockContext } from '../../context';
import { NotFoundException } from '@nestjs/common';

let mockCtx: MockContext;
let ctx: Context;

beforeEach(() => {
  mockCtx = createMockContext();
  ctx = mockCtx as unknown as Context;
});

test('should create new user ', async () => {
  const user = {
    id: '1',
    name: 'Vanessa',
    lastName: 'Iniguez',
    email: 'vanessa@unl.edu.ec',
    password: '12345',
    displayName: 'Vanessa Iniguez',
    refreshToken: '11111',
    city: 'Loja',
    isActive: true,
    phoneNumber: 93333444,
    identificationCard: '111111111',
  };
  mockCtx.prisma.user.create.mockResolvedValue(user);

  await expect(createUser(user, ctx)).resolves.toEqual({
    id: '1',
    name: 'Vanessa',
    lastName: 'Iniguez',
    email: 'vanessa@unl.edu.ec',
    password: '12345',
    displayName: 'Vanessa Iniguez',
    refreshToken: '11111',
    city: 'Loja',
    isActive: true,
    phoneNumber: 93333444,
    identificationCard: '111111111',
  });
});

test('should return not found exception when the user does not exist', async () => {
  mockCtx.prisma.user.findUnique.mockResolvedValue(null);

  await expect(getByEmail('vanessa.iniguez@unl.edu.ec', ctx)).rejects.toThrow(
    NotFoundException,
  );
});

test('should return a user by email', async () => {
  const user = {
    id: '1',
    name: 'Vanessa',
    lastName: 'Iniguez',
    email: 'vanessa@unl.edu.ec',
    password: '12345',
    displayName: 'Vanessa Iniguez',
    refreshToken: '11111',
    city: 'Loja',
    isActive: true,
    phoneNumber: 93333444,
    identificationCard: '111111111',
  };

  mockCtx.prisma.user.findUnique.mockResolvedValue(user);

  await expect(getByEmail(user.email, ctx)).resolves.toEqual({
    id: '1',
    name: 'Vanessa',
    lastName: 'Iniguez',
    email: 'vanessa@unl.edu.ec',
    password: '12345',
    displayName: 'Vanessa Iniguez',
    refreshToken: '11111',
    city: 'Loja',
    isActive: true,
    phoneNumber: 93333444,
    identificationCard: '111111111',
  });
});

test('should return all users', async () => {
  const users = [
    {
      id: '1',
      name: 'Vanessa',
      lastName: 'Iniguez',
      email: 'vanessa@unl.edu.ec',
      password: '12345',
      displayName: 'Vanessa Iniguez',
      refreshToken: '11111',
      city: 'Loja',
      isActive: true,
      phoneNumber: 93333444,
      identificationCard: '111111111',
    },
    {
      id: '2',
      name: 'Alexis',
      lastName: 'Canar',
      email: 'alexis@unl.edu.ec',
      password: '12345',
      displayName: 'Alexis Canar',
      refreshToken: '11111',
      city: 'Loja',
      isActive: true,
      phoneNumber: 93458324,
      identificationCard: '111111111',
    },
  ];
  mockCtx.prisma.user.findMany.mockResolvedValue(users);

  await expect(findAll(ctx)).resolves.toEqual([
    {
      id: '1',
      name: 'Vanessa',
      lastName: 'Iniguez',
      email: 'vanessa@unl.edu.ec',
      password: '12345',
      displayName: 'Vanessa Iniguez',
      refreshToken: '11111',
      city: 'Loja',
      isActive: true,
      phoneNumber: 93333444,
      identificationCard: '111111111',
    },
    {
      id: '2',
      name: 'Alexis',
      lastName: 'Canar',
      email: 'alexis@unl.edu.ec',
      password: '12345',
      displayName: 'Alexis Canar',
      refreshToken: '11111',
      city: 'Loja',
      isActive: true,
      phoneNumber: 93458324,
      identificationCard: '111111111',
    },
  ]);

  await expect(findAll(ctx)).resolves.toHaveLength(2);
});
