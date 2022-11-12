import { Subjects } from "./subject";

export interface TicketCreated {
  subject: Subjects.TicketCreated,
  data:{
    id: string,
    price: number,
    title: string
  }
}