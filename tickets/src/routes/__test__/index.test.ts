import request from 'supertest';
import {app} from '../../app';


const createTicket = async () => {
  await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signup())
        .send({
          title: 'ticket1',
          price:50
        })
        .expect(201)
} 
it('should fetch list of tickets', async() =>{

    await createTicket()
    await createTicket()
    await createTicket()

    const response = await request(app)
        .get('/api/tickets')
        .send()
        .expect(200)
    expect(response.body.length).toEqual(3)
})