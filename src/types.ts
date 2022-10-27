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
  team0: string;
  team1: string;
}

export interface IComment {
  comment_id: number;
  comment: string;
  match_id: number;
  email: string;
  datetime: string;
}
