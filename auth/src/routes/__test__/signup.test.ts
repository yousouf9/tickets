import request from 'supertest';
import { app } from '../../app';

it('should return 201 on a successful signup', async () => {
    return request(app)
          .post('/api/users/signup')
          .send({
            password: 'aminat4',
            email:'aminat@gmail.com'
          })
          .expect(201)
})

it('return 400 with an invalid email', async () => {
    return request(app)
      .post('/api/users/signup')
      .send({
        password: 'aminat4',
        email: 'aminat@'
      })
      .expect(400)
})
it('return 400 with an invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      password: 'aminat4454566',
      email: 'aminat@gmail.com'
    })
    .expect(400)
})

it('return 400 with missing email and password', async () => {
  await request(app)
      .post('/api/users/signup')
      .send({
        email:"ibrahm@gamil.com"
      })
  .expect(400)
  return request(app)
    .post('/api/users/signup')
    .send({
        password:'34564s'
    })
    .expect(400)
})

it('should not allow duplicate emails', async () => {
  await request(app)
      .post('/api/users/signup')
      .send({
        email:"ibrahm@gamil.com",
        password:'34564s'
      })
      .expect(201)
  return request(app)
    .post('/api/users/signup')
    .send({
        email:"ibrahm@gamil.com",
        password:'34564s'
    })
    .expect(400)
})

it('set a cookie after successful signup', async () => {
  const response = await request(app)
          .post('/api/users/signup')
          .send({
            password: 'aminat4',
            email: 'aminat@gmail.com'
          })
          .expect(201)
   expect(response.get('Set-Cookie')).toBeDefined();
})
