import request from 'supertest';

import { app } from '../../app';

it('should return details of current user', async () => {
   const cookie = await signup();
  
   const response = await request(app)
                          .get('/api/users/currentuser')
                          .set('Cookie', cookie)
                          .send()
                          .expect(200)
    expect(response.body.currentUser.email).toEqual('user@example.com');
   
})

it('should return null if not authenticated', async () => {
  const response = await request(app)
                        .get('/api/users/currentuser')
                        .send()
                        .expect(200)
  expect(response.body.currentUser).toBe(null);
})