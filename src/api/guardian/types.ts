export interface GuardianNews {
  apiUrl: string;
  id: string;
  isHosted: boolean;
  pillarId: string;
  pillarName: string;
  sectionId: string;
  sectionName: string;
  type: string;
  webPublicationDate: string;
  webTitle: string;
  webUrl: string;
}

export interface GuardianNewsResponse {
  currentPage: number;
  orderBy: string;
  pageSize: number;
  pages: number;
  results: GuardianNews[];
  startIndex: number;
  status: string;
  total: number;
  userTier: string;
}

export interface GuardianSection {
  apiUrl: string;
  editions: {
    apiUrl: string;
    code: string;
    id: string;
    webTitle: string;
    webUrl: string;
  }[];
  id: string;
  webTitle: string;
  webUrl: string;
}

export interface GuardianSectionsResponse {
  results: GuardianSection[];
  status: string;
  total: number;
  userTier: string;
}
