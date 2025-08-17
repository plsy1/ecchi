export interface ActressRanking {
  rank: string;
  name: string;
  image: string;
  profile_url: string;
  latest_work: string;
  latest_work_url: string;
  work_count: number;
}

export interface RankingItem {
  rank: string;
  title: string;
  number: string;
  image: string;
  detail_url: string;
  maker: string | null;
  actresses: string[];
}

export enum RankingTypeOfWorks {
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly',
}