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
  Proposal?: {
    id: number;
    organisationId: number;
    clientId: number;
    leadId: number;
    cost: number;
    status: string;
    leadDescription: string;
    Client?: {
      emailId: string;
      firstName: string;
      lastName: string;
    };
  };
}
