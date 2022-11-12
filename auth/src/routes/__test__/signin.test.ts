import request from 'supertest';

import { app } from '../../app';

it('it failed with email that does not exist', async () => {
   return request(app)
          .post('/api/users/signin')
          .send({ 
            email: 'ibraheemyousouf@gmail.com',
            password: 'passw1d'
          })
          .expect(400)
})

it('it failed with a wrong email', async () => {
    await request(app)
         .post('/api/users/signup')
         .send({ 
           email: 'ibraheemyousouf@gmail.com',
           password: 'passw1d'
         })
         .expect(201)
    await request(app)
         .post('/api/users/signup')
         .send({ 
           email: 'ibraheemyousouf@gmail.com',
           password: 'passw1'
         })
         .expect(400)
})

it('it should return 200 and set-cookie for successful login', async () => {
  await request(app)
        .post('/api/users/signup')
        .send({ 
          email: 'ibraheemyousouf@gmail.com',
          password: 'passw1d'
        })
        .expect(201)
 const response = await request(app)
        .post('/api/users/signin')
        .send({ 
          email: 'ibraheemyousouf@gmail.com',
          password: 'passw1d'
        })
        .expect(200)
  expect(response.get('Set-Cookie')).toBeDefined();
})