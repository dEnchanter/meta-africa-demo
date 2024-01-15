type PlayerStat = {
  _id?: string;
  player_id?: string;
  team_id?: string;
  game_id?: string;
  two_points_made?: number;
  two_points_attempted?: number;
  two_points?: number;
  three_points_made?: number;
  three_points_attempted?: number;
  three_points?: number;
  free_throw_made?: number;
  free_throw_attempted?: number;
  free_throw?: number;
  offensive_rebounds?: number;
  defensive_rebounds?: number;
  total_rebounds?: number;
  assists?: number;
  turnovers?: number;
  steals?: number;
  blocks?: number;
  fouls?: number;
  efficiency?: number;
  minute_played?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  // __v: number;
};
