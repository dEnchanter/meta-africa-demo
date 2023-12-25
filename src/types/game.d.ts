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
  date?: string;
  time?: string;
  stadium?: string;
};