import { createRole, findAll, findOne } from '../../function/role-context';
import { MockContext, Context, createMockContext } from '../../context';

let mockCtx: MockContext;
let ctx: Context;

beforeEach(() => {
  mockCtx = createMockContext();
  ctx = mockCtx as unknown as Context;
});

test('should create new role ', async () => {
  const role = {
    id: '1',
    name: 'MANAGER',
  };
  mockCtx.prisma.role.create.mockResolvedValue(role);

  await expect(createRole(role, ctx)).resolves.toEqual({
    id: '1',
    name: 'MANAGER',
  });
});

test('should return all roles', async () => {
  const roles = [
    {
      id: '1',
      name: 'MANAGER',
    },
    {
      id: '1',
      name: 'TEACHER',
    },
  ];
  mockCtx.prisma.role.findMany.mockResolvedValue(roles);

  await expect(findAll(ctx)).resolves.toEqual([
    {
      id: '1',
      name: 'MANAGER',
    },
    {
      id: '1',
      name: 'TEACHER',
    },
  ]);

  await expect(findAll(ctx)).resolves.toHaveLength(2);
});

test('should return a role', async () => {
  const role = {
    id: '1',
    name: 'MANAGER',
  };

  mockCtx.prisma.role.findUnique.mockResolvedValue(role);

  await expect(findOne(role.id, ctx)).resolves.toEqual({
    id: '1',
    name: 'MANAGER',
  });
});
