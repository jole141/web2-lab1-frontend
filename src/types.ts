export interface Club {
  fc_id: number;
  name: string;
  points: number;
  victories: number;
  tied: number;
  losses: number;
  scored_points: number;
}

export interface Match {
  match_id: number;
  score_point_0: number;
  score_point_1: number;
  date: string;
  finished: boolean;
  team0: number;
  team1: number;
}
