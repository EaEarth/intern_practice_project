import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '../role/role.enum';
import { User, UserDocument } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            index: jest.fn().mockImplementation(() => {
              return Promise.resolve(userList);
            }),
            create: jest.fn().mockImplementation((dto) => {
              const { password, ...info } = dto;
              const createdUserDoc = {
                ...info,
                ...{ id: '60c06c3c648f344e440ced70' },
              };
              return Promise.resolve(createdUserDoc);
            }),
            update: jest.fn().mockImplementation((dto) => {
              if (dto.id !== user.id)
                throw new NotFoundException('User not found');
              const updated = { ...user, ...dto };
              return Promise.resolve(updated);
            }),
            delete: jest.fn().mockImplementation((userId) => {
              if (userId !== user.id)
                throw new NotFoundException('User not found');
              return Promise.resolve(user);
            }),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userController = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('index user', () => {
    it('index should return an array of users', async () => {
      expect(await userController.index()).toBe(userList);
    });
  });

  describe('create user', () => {
    it('Basic create user should return an user with id and without password ', async () => {
      const completeInformation = {
        firstName: 'userFirstname',
        lastName: 'userLastname',
        mobile: '0802345678',
        email: 'user@mail.com',
        password: 'test',
        role: [Role.User, Role.Admin],
      };
      const result = await userController.create(completeInformation);
      expect(result).toStrictEqual(user);
    });
  });

  describe('update user', () => {
    it('update should return updated user', async () => {
      const updateInformation = {
        id: '60c06c3c648f344e440ced70',
        firstName: 'newFirstname',
        lastName: 'newLastname',
      };
      const result = await userController.update(updateInformation);
      const expected = {
        id: '60c06c3c648f344e440ced70',
        firstName: 'newFirstname',
        lastName: 'newLastname',
        mobile: '0802345678',
        email: 'user@mail.com',
        role: [Role.User, Role.Admin],
      };
      expect(result).toStrictEqual(expected);
    });

    it('update non-existing user should throw NotFoundException', async () => {
      const updateInformation = {
        id: 'ShouldNotFoundThisId',
        firstName: 'newFirstname',
        lastName: 'newLastname',
      };
      try {
        const updatedUser = await userController.update(updateInformation);
        expect(updatedUser).toBeUndefined();
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('delete user', () => {
    it('delete should return a deleted user', async () => {
      const userId = '60c06c3c648f344e440ced70';
      expect(await userController.delete(userId)).toStrictEqual(user);
    });

    it('delete non-existing user should throw NotFoundException', async () => {
      const userId = 'ShouldNotFoundThisId';
      try {
        const deletedUser = await userController.delete(userId);
        expect(deletedUser).toBeUndefined();
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }
    });
  });
});

const userList = [
  {
    firstName: 'userFirstname',
    lastName: 'userLastname',
    mobile: '0802345678',
    email: 'user@mail.com',
    password: 'test',
    role: [Role.User],
  },
];

const user = {
  id: '60c06c3c648f344e440ced70',
  firstName: 'userFirstname',
  lastName: 'userLastname',
  mobile: '0802345678',
  email: 'user@mail.com',
  role: [Role.User, Role.Admin],
};
