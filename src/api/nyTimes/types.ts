export interface NYTimesNews {
  abstract: string;
  document_type: string;
  headline: { main: string; print_headline: string };
  keywords: { major: string; name: string; rank: number; value: string }[];
  lead_paragraph: string;
  news_desk: string;
  print_page: string;
  print_section: string;
  pub_date: string;
  section_name: string;
  snippet: string;
  source: string;
  type_of_material: string;
  uri: string;
  web_url: string;
  word_count: number;
  _id: string;
}

export interface NYTimesNewsResponse {
  copyright: string;
  response: {
    docs: NYTimesNews[];
    meta: {
      hits: number;
      offset: number;
      time: number;
    };
  };
  status: string;
}

export interface NYTimesCategoriesResponse {
  copyright: string;
  num_results: number;
  results: {
    displayName: string;
    section: string;
  }[];
  status: string;
}

export interface NYTimesNewsByCategory {
  abstract: string;
  byline: string;
  created_date: string;
  des_facet: string[];
  first_published_date: string;
  geo_facet: string[];
  item_type: string;
  kicker: string;
  material_type_facet: string;
  multimedia: {
    caption: string;
    copyright: string;
    format: string;
    height: number;
    subtype: string;
    type: string;
    url: string;
    width: number;
  }[];
  published_date: string;

  section: string;
  slug_name: string;
  source: string;
  subheadline: string;
  subsection: string;
  title: string;
  updated_date: string;
  uri: string;
  url: string;
}

export interface NYTimesNewsByCategoryResponse {
  copyright: string;
  num_results: number;
  results: NYTimesNewsByCategory[];
  status: string;
}
