interface TeamInfo {
  name: string;
  logo: string;
}

interface Match {
  team: TeamInfo;
  opponent: TeamInfo;
  quarterResult: Array<{
    quarterNumber: number;
    team1Score: number;
    team2Score: number;
    _id: string;
  }>;
  finalResult: {
    team1Score: number;
    team2Score: number;
    _id: string;
  };
  date: string;
  time: string;
  stadium: string;
  game_id: string;
}

type MatchData = {
  date: string;
  finalResult: {
    team1Score: number;
    team2Score: number;
    _id: string;
  };
  game_id: string;
  opponent: {
    id: string;
    name: string;
    logo: string;
  };
  quarterResult: Array<{
    quarterNumber: number;
    team1Score: number;
    team2Score: number;
    _id: string;
  }>;
  stadium: string;
  team: {
    id: string;
    name: string;
    logo: string;
  };
  time: string;
};