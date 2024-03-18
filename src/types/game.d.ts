type Game = {
  team: {
    id?: string;
    name?: string;
    logo?: string;
  };
  opponent: {
    id?: string;
    name?: string;
    logo?: string;
  };
  quarterResult?: Array<{
    quarterNumber: number;
    team1Score: number;
    team2Score: number;
    _id: string;
  }>;
  finalResult?: {
    team1Score?: number; // assuming score is a number
    team2Score?: number;
    _id?: string;
  };
  date?: string;
  time?: string;
  stadium?: string;
  game_id?: string;
  gender?: string;
};