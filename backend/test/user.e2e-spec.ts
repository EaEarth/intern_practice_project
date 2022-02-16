import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { assert } from 'console';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQG1haWwuY29tIiwic3ViIjoiNjBjMmU1ZjljMzYzZGM1YmE0MWQ4NWZkIiwicm9sZXMiOlsiYWRtaW4iXSwiaWF0IjoxNjIzMzg1NjA1LCJleHAiOjE2MjMzODYyMDV9.0Q7Ckbw-5aMaCN_Fq8dUKGoPP-vv8vFxuBPRq53k3ew';

  beforeAll(async () => {
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
        .set('Authorization', 'Bearer ' + token)
        .send({
          firstName: 'testFirstname',
          lastName: 'testLastName',
          mobile: '0802222222',
          email: 'testEmail@mail.com',
          password: 'test',
        })
        .expect(201)
        .then((response) => {
          const { id, ...info } = response.body;
          assert(info, {
            firstName: 'testFirstname',
            lastName: 'testLastName',
            mobile: '0802222222',
            email: 'testEmail@mail.com',
            role: ['user'],
          });
          done();
        })
        .catch((err) => done(err));
    });
  });

  describe('index user', () => {
    it('/user (GET) should return a list of user', (done) => {
      return request(app.getHttpServer())
        .get('/user')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .then((response) => {
          const { id, ...info } = response.body;
          assert(response.body, [
            {
              firstName: 'testFirstname',
              lastName: 'testLastName',
              mobile: '0802222222',
              email: 'testEmail@mail.com',
              role: ['user'],
            },
          ]);
          done();
        })
        .catch((err) => done(err));
    });
  });

  describe('delete user', () => {
    it('/user (DELETE) should return a deleted user', (done) => {
      return request(app.getHttpServer())
        .delete('/user')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .then((response) => {
          const { id, ...info } = response.body;
          assert(response.body, {
            firstName: 'testFirstname',
            lastName: 'testLastName',
            mobile: '0802222222',
            email: 'testEmail@mail.com',
            role: ['user'],
          });
          done();
        })
        .catch((err) => done(err));
    });
  });
});
