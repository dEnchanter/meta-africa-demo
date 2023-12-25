type Player = {
  _id?: string;
  team_id?: string;
  name?: string;
  date_of_birth?: string;
  height?: number;
  weight?: number;
  position?: string;
  wingspan?: string;
  gender?: string;
  avatar?: string;
  nationality?: string;
  assigned_country?: string;
  jersey_number?: number;
  scout_grade?: string;
  regional_rank?: string;
  position_rank?: string;
  country_rank?: string;
  avg_points?: string;
  avg_rebounds?: string;
  avg_assists?: string;
  avg_blocks?: string;
  avg_goal_points?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  team_data?: TeamData
  // __v: number;
};

type TeamData = {
  _id?: string;
  name?: string;
  founded_year?: number;
  city?: string;
  home_stadium?: string;
  logo_url?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  // __v: number;
  team_gender?: string;
};