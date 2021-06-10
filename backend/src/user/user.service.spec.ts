import { BadRequestException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { Role } from '../role/role.enum';
import { User } from './schemas/user.schema';
import { UserService } from './user.service';
class UserModel {
  private data = {};
  private option = {};
  constructor(data) {
    this.data = data;
  }
  save = jest.fn().mockImplementation(() => {
    return { ...{ id: '60c06c3c648f344e440ced70' }, ...this.data };
  });
  find = jest.fn().mockImplementation(() => {
    this.data = [user];
    return this;
  });
  findByIdAndDelete = jest.fn().mockImplementation((userId) => {
    this.data = userId === user.id ? user : null;
    return this;
  });
  findById = jest.fn().mockImplementation((userId) => {
    this.data = userId === user.id ? user : null;
    return this;
  });
  exec = jest.fn().mockImplementation(() => {
    return Promise.resolve(this.data);
  });
  findByIdAndUpdate = jest.fn().mockImplementation((userId, dto, options) => {
    const id = '60c06c3c648f344e440ced70';
    const updatedUser = { ...user, ...dto };
    this.data = userId === id ? updatedUser : null;
    return this;
  });
  findOne = jest.fn().mockImplementation((option) => {
    const filter = Object.keys(option);
    filter.forEach((key) => {
      if (!user[key]) throw new BadRequestException("attribute doesn't exist");
      if (user[key] !== option[key]) return null;
    });
    this.data = info;
    return this;
  });
  select = jest.fn().mockImplementation((option) => {
    const filter = option.split(' ');
    const result = {};
    filter.forEach((attr) => {
      if (!this.data[attr]) {
        throw new BadRequestException("select attribute doesn't exist");
      }
      result[attr] = this.data[attr];
    });
    this.data = result;
    return this;
  });
}

describe('UserService function in which have to create a new model', () => {
  let userService: UserService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: UserModel,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('create user with complete info should return new created user', async () => {
    const newUser = await userService.create(info);
    const { password, ...result } = newUser;
    expect(result).toStrictEqual(user);
    expect(password).toBeDefined();
  });
});

describe('UserService function in which does not have to create a new model', () => {
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: new UserModel({}),
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('index user', () => {
    it('index user should return a list of users', async () => {
      const result = await userService.index();
      expect(result).toStrictEqual([user]);
    });
  });

  describe('find user by id', () => {
    it('find user by id should return an user', async () => {
      const id = '60c06c3c648f344e440ced70';
      const result = await userService.findById(id);
      expect(result).toStrictEqual(user);
    });

    it('find user by id should return null if the user does not exist', async () => {
      const id = 'DoesNotExistId';
      const result = await userService.findById(id);
      expect(result).toBe(null);
    });
  });

  describe('update user', () => {
    it('update user should return an updated user', async () => {
      const info = {
        id: '60c06c3c648f344e440ced70',
        firstName: 'NewFirstname',
        lastName: 'NewLastname',
        role: [Role.User],
      };
      const result = await userService.update(info);
      expect(result).toStrictEqual(updatedUser);
    });

    it('update user should return null if the user does not exist', async () => {
      const info = {
        id: 'DoesNotExistId',
        firstName: 'NewFirstname',
        lastName: 'NewLastname',
      };
      const result = await userService.update(info);
      expect(result).toBe(null);
    });
  });

  describe('delete user by id', () => {
    it('delete user by id should return an user', async () => {
      const id = '60c06c3c648f344e440ced70';
      const result = await userService.delete(id);
      expect(result).toStrictEqual(user);
    });

    it('delete user by id should return null if the user does not exist', async () => {
      const id = 'DoesNotExistId';
      const result = await userService.delete(id);
      expect(result).toBe(null);
    });
  });

  describe('find user by email', () => {
    it('find user by id should return email, password and role', async () => {
      const email = 'user@mail.com';
      const result = await userService.findByEmail(email);
      const expected = {
        email: 'user@mail.com',
        password: 'test',
        role: [Role.User, Role.Admin],
      };
      expect(result).toStrictEqual(expected);
    });

    it('find user by id should return null if the user does not exist', async () => {
      const id = 'DoesNotExistId';
      const result = await userService.findById(id);
      expect(result).toBe(null);
    });
  });
});

const info = {
  firstName: 'userFirstname',
  lastName: 'userLastname',
  mobile: '0802345678',
  email: 'user@mail.com',
  password: 'test',
  role: [Role.User, Role.Admin],
};

const user = {
  id: '60c06c3c648f344e440ced70',
  firstName: 'userFirstname',
  lastName: 'userLastname',
  mobile: '0802345678',
  email: 'user@mail.com',
  role: [Role.User, Role.Admin],
};

const updatedUser = {
  id: '60c06c3c648f344e440ced70',
  firstName: 'NewFirstname',
  lastName: 'NewLastname',
  mobile: '0802345678',
  email: 'user@mail.com',
  role: [Role.User],
};
