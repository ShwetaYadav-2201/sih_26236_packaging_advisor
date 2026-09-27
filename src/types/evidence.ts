export type EvidenceClass = 
  | 'measured' 
  | 'reference' 
  | 'derived' 
  | 'assumed';

export type ReviewStatus = 
  | 'reviewed_reference' 
  | 'measured_case' 
  | 'assumption_dependent' 
  | 'unreviewed';

export interface EvidenceSource {
  id: string;
  title: string;
  authorsOrOrg: string;
  urlOrDoi: string;
  year: number;
  publisher?: string;
  evidenceClass: EvidenceClass;
  locator: string; // e.g. "Table 3.2, p. 142" or "Section 4.1"
  reviewStatus: ReviewStatus;
  notes?: string;
}

export interface EvidentiaryValue<T = number> {
  value: T;
  unit: string;
  sourceId: string;
  evidenceClass: EvidenceClass;
  conditions?: {
    temperatureC?: number;
    rhPercent?: number;
    pressurePa?: number;
    testMethod?: string; // e.g., ASTM D3985
  };
  notes?: string;
}
