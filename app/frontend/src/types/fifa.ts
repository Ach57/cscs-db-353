export interface FIFAParticipant {
  game_id: number;
  membership_number: number;
  first_name: string;
  last_name: string;
}

export interface FIFAGame {
  game_id: number;
  location_id: number;
  team_name: string;
  opponent_name: string;
  game_date: string;
  team_score: number;
  opponent_score: number;
  location_name?: string;
  participant_count?: number;
}

export interface FIFAGameWithParticipants extends FIFAGame {
  participants: FIFAParticipant[];
}

export type FIFAGameInput = Omit<FIFAGame, "game_id" | "location_name" | "participant_count">;

export interface FIFAParticipantOverview {
  membership_number: number;
  first_name: string;
  last_name: string;
  location_id: number;
  location_name: string;
  fifa_game_count: number;
  fifa_games: string | null;
}
