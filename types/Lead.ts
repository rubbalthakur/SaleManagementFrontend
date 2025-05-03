export interface Lead {
  id: number;
  userId: number;
  organisationId: number;
  leadTypeId: number;
  leadSourceId: number;
  firstName: string;
  lastName: string;
  emailId: string;
  description: string;
  status: string;
  leadTypeName: string;
  leadSourceName: string;
}
