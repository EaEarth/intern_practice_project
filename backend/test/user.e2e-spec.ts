import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { assert } from 'console';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Create user', () => {
    it('/user (POST) should create successfully', (done) => {
      return request(app.getHttpServer())
        .post('/user')
        .send({
          firstName: 'testFirstname',
          lastName: 'testLastName',
          mobile: '0802222222',
          email: 'testEmail@mail.com',
        })
        .expect(201)
        .then((response) => {
          const { id, ...info } = response.body;
          assert(info, {
            firstName: 'testFirstname',
            lastName: 'testLastName',
            mobile: '0802222222',
            email: 'testEmail@mail.com',
          });
          done();
        })
        .catch((err) => done(err));
    });
  });
});
