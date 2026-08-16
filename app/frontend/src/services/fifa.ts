import { api } from "./api";
import type {
  FIFAGame,
  FIFAGameInput,
  FIFAGameWithParticipants,
  FIFAParticipantOverview,
} from "../types/fifa";

export const getFifaGames = () => api.get<FIFAGame[]>("/fifa-games");
export const getFifaGame = (gameId: number) => api.get<FIFAGameWithParticipants>(`/fifa-games/${gameId}`);
export const createFifaGame = (input: FIFAGameInput) => api.post<FIFAGameWithParticipants>("/fifa-games", input);
export const addFifaParticipant = (gameId: number, membershipNumber: number) =>
  api.post<FIFAGameWithParticipants>(`/fifa-games/${gameId}/participants`, { membership_number: membershipNumber });
export const removeFifaParticipant = (gameId: number, membershipNumber: number) =>
  api.delete(`/fifa-games/${gameId}/participants/${membershipNumber}`);
export const getFifaParticipantOverview = () =>
  api.get<FIFAParticipantOverview[]>("/fifa-games/participant-overview");
