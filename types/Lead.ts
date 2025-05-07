export interface Lead {
  id: number;
  userId: number;
  organisationId: number;
  leadTypeId: number;
  leadSourceId: number;
  status: string;
  description: string;
  User: {
    emailId: string;
    firstName: string;
    lastName: string;
  };
  LeadType: {
    leadTypeName: string;
  };
  LeadSource: {
    leadSourceName: string;
  };
}
