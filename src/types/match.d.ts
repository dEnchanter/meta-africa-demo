interface TeamInfo {
  name: string;
  logo: string;
}

interface Match {
  team: TeamInfo;
  opponent: TeamInfo;
  date: string;
  time: string;
  stadium: string;
}