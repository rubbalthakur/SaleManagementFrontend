export interface LeadMessage {
  id: number;
  userId: number;
  leadId: number;
  message: string;
  createdAt: string;
  User: {
    emailId: string;
    firstName: string;
    lastName: string;
  };
}
