import { type FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import type { ColDef } from "ag-grid-community";
import Button from "../components/common/Button";
import DataGrid from "../components/common/data-grid/DataGrid";
import { Field, Input } from "../components/common/Input";
import {
  CardHeader,
  ContentCard,
  EmptyState,
  PageHeader,
  PageShell,
  StatusMessage,
  Toolbar,
  ToolbarActions,
} from "../components/common/page/ManagementPage";
import { locationApi } from "../services/locations";
import {
  addFifaParticipant,
  createFifaGame,
  getFifaGame,
  getFifaGames,
  getFifaParticipantOverview,
  removeFifaParticipant,
} from "../services/fifa";
import type { Location } from "../types/location";
import type { FIFAGame, FIFAGameWithParticipants, FIFAParticipantOverview } from "../types/fifa";

function today() {
  return new Date().toISOString().slice(0, 10);
}

function messageOf(error: unknown) {
  return error instanceof Error ? error.message : "The request failed.";
}

export default function FifaGames() {
  const [games, setGames] = useState<FIFAGame[]>([]);
  const [members, setMembers] = useState<FIFAParticipantOverview[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedGame, setSelectedGame] = useState<FIFAGameWithParticipants | null>(null);
  const [memberNumber, setMemberNumber] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [locationId, setLocationId] = useState("");
  const [teamName, setTeamName] = useState("");
  const [opponentName, setOpponentName] = useState("");
  const [gameDate, setGameDate] = useState(today());
  const [teamScore, setTeamScore] = useState("0");
  const [opponentScore, setOpponentScore] = useState("0");

  const loadPageData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [gameRows, memberRows, locationRows] = await Promise.all([
        getFifaGames(),
        getFifaParticipantOverview(),
        locationApi.getAll(),
      ]);
      setGames(gameRows);
      setMembers(memberRows);
      setLocations(locationRows);
      if (locationRows[0]) setLocationId((current) => current || String(locationRows[0].location_id));
    } catch (requestError) {
      setError(messageOf(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadPageData(); }, [loadPageData]);

  const visibleMembers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return members;
    return members.filter((member) =>
      [member.membership_number, member.first_name, member.last_name, member.location_name, member.fifa_games]
        .some((value) => String(value ?? "").toLowerCase().includes(term)),
    );
  }, [members, search]);

  async function selectGame(gameId: number) {
    setError("");
    setMessage("");
    try {
      setSelectedGame(await getFifaGame(gameId));
    } catch (requestError) {
      setError(messageOf(requestError));
    }
  }

  async function addParticipant() {
    if (!selectedGame) {
      setError("Select a FIFA game first.");
      return;
    }
    const membershipNumber = Number(memberNumber);
    if (!Number.isInteger(membershipNumber) || membershipNumber <= 0) {
      setError("Choose or enter a valid membership number.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");
    try {
      const updated = await addFifaParticipant(selectedGame.game_id, membershipNumber);
      setSelectedGame(updated);
      setMessage(`Member #${membershipNumber} was added to the FIFA game.`);
      setMemberNumber("");
      const [gameRows, memberRows] = await Promise.all([getFifaGames(), getFifaParticipantOverview()]);
      setGames(gameRows);
      setMembers(memberRows);
    } catch (requestError) {
      // Database trigger messages are returned by the API unchanged, which makes
      // TC-026 and TC-027 directly observable from this screen.
      setError(messageOf(requestError));
    } finally {
      setSaving(false);
    }
  }

  async function removeParticipant(membershipNumber: number) {
    if (!selectedGame) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      await removeFifaParticipant(selectedGame.game_id, membershipNumber);
      setSelectedGame(await getFifaGame(selectedGame.game_id));
      setMessage(`Member #${membershipNumber} was removed from the FIFA game.`);
      const [gameRows, memberRows] = await Promise.all([getFifaGames(), getFifaParticipantOverview()]);
      setGames(gameRows);
      setMembers(memberRows);
    } catch (requestError) {
      setError(messageOf(requestError));
    } finally {
      setSaving(false);
    }
  }

  async function createGame(event: FormEvent) {
    event.preventDefault();
    const location = Number(locationId);
    const ours = Number(teamScore);
    const theirs = Number(opponentScore);
    if (!location || !teamName.trim() || !opponentName.trim() || !gameDate) {
      setError("Location, team, opponent, and game date are required.");
      return;
    }
    if (!Number.isInteger(ours) || ours < 0 || !Number.isInteger(theirs) || theirs < 0) {
      setError("Scores must be non-negative whole numbers.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");
    try {
      const created = await createFifaGame({
        location_id: location,
        team_name: teamName.trim(),
        opponent_name: opponentName.trim(),
        game_date: gameDate,
        team_score: ours,
        opponent_score: theirs,
      });
      setSelectedGame(created);
      setTeamName("");
      setOpponentName("");
      setTeamScore("0");
      setOpponentScore("0");
      setMessage(`FIFA game #${created.game_id} was created and selected.`);
      setGames(await getFifaGames());
    } catch (requestError) {
      setError(messageOf(requestError));
    } finally {
      setSaving(false);
    }
  }


  const gameColumns = useMemo<ColDef<FIFAGame>[]>(() => [
    { field: "game_id", headerName: "Game ID" },
    { field: "game_date", headerName: "Date", valueFormatter: ({ value }) => String(value ?? "").slice(0, 10) },
    { headerName: "Location", valueGetter: ({ data }) => data?.location_name ?? data?.location_id ?? "" },
    { field: "team_name", headerName: "Team" },
    { field: "opponent_name", headerName: "Opponent" },
    { headerName: "Score", valueGetter: ({ data }) => data ? `${data.team_score} - ${data.opponent_score}` : "" },
    { field: "participant_count", headerName: "Participants", valueFormatter: ({ value }) => String(value ?? 0) },
  ], []);

  const participantColumns = useMemo<ColDef<FIFAGameWithParticipants["participants"][number]>[]>(() => [
    { field: "membership_number", headerName: "Membership #" },
    { headerName: "Participant", valueGetter: ({ data }) => data ? `${data.first_name} ${data.last_name}` : "" },
    {
      headerName: "Action",
      sortable: false,
      filter: false,
      cellRenderer: ({ data }: { data?: FIFAGameWithParticipants["participants"][number] }) => data ? (
        <Button variant="danger" style={{
          height: "-webkit-fill-available",
          textBox: "trim-both",
        }} onClick={() => void removeParticipant(data.membership_number)} disabled={saving}>Remove</Button>
      ) : null,
    },
  ], [saving, selectedGame]);

  const memberColumns = useMemo<ColDef<FIFAParticipantOverview>[]>(() => [
    { field: "membership_number", headerName: "Member ID" },
    { headerName: "Member", valueGetter: ({ data }) => data ? `${data.first_name} ${data.last_name}` : "" },
    { field: "location_name", headerName: "Current location" },
    { field: "fifa_games", headerName: "FIFA games", valueFormatter: ({ value }) => value ?? "Never participated" },
    { field: "fifa_game_count", headerName: "Count" },
  ], []);

  return (
    <PageShell className="fifa-page">
      <PageHeader
        eyebrow="FIFA participation"
        title="FIFA Games & Participants"
        description="Create FIFA games, select a game, and add eligible club members. Fee and minor-family eligibility are enforced by the database trigger when a participant is saved."
        aside={<div className="management-health management-health--ok"><strong>{games.length} FIFA games</strong><span>{members.length} club members available</span></div>}
      />

      {error && <StatusMessage tone="error">{error}</StatusMessage>}
      {message && <StatusMessage>{message}</StatusMessage>}

      <ContentCard>
        <CardHeader title="Create FIFA game" description="Create a game record first, or select an existing game below." />
        <form onSubmit={(event) => void createGame(event)}>
          <Toolbar>
            <Field label="Location ID">
              <Input type="number" min={1} list="fifa-location-ids" value={locationId} onChange={(event) => setLocationId(event.target.value)} />
            </Field>
            <datalist id="fifa-location-ids">
              {locations.map((location) => <option key={location.location_id} value={location.location_id}>{location.name}</option>)}
            </datalist>
            <Field label="Team name"><Input value={teamName} onChange={(event) => setTeamName(event.target.value)} /></Field>
            <Field label="Opponent"><Input value={opponentName} onChange={(event) => setOpponentName(event.target.value)} /></Field>
            <Field label="Game date"><Input type="date" value={gameDate} onChange={(event) => setGameDate(event.target.value)} /></Field>
            <Field label="Team score"><Input type="number" min={0} step={1} value={teamScore} onChange={(event) => setTeamScore(event.target.value)} /></Field>
            <Field label="Opponent score"><Input type="number" min={0} step={1} value={opponentScore} onChange={(event) => setOpponentScore(event.target.value)} /></Field>
            <ToolbarActions><Button type="submit" variant="primary" disabled={saving}>Create game</Button></ToolbarActions>
          </Toolbar>
        </form>
      </ContentCard>

      <ContentCard>
        <CardHeader title="FIFA games" description="Select a row to open its participant roster." meta={selectedGame ? `Selected #${selectedGame.game_id}` : "No game selected"} />
        {games.length === 0 && !loading ? <EmptyState>No FIFA games found.</EmptyState> : (
          <DataGrid<FIFAGame>
            rowData={games}
            columnDefs={gameColumns}
            loading={loading}
            pagination={games.length > 20}
            pageSize={20}
            getRowId={(game) => String(game.game_id)}
            onRowClick={(game) => void selectGame(game.game_id)}
          />
        )}
      </ContentCard>

      <ContentCard>
        <CardHeader
          title={selectedGame ? `Participants — ${selectedGame.team_name} vs ${selectedGame.opponent_name}` : "FIFA participants"}
          description={selectedGame ? `Game #${selectedGame.game_id} on ${String(selectedGame.game_date).slice(0, 10)}. Add a member below to exercise FIFA eligibility rules.` : "Select a FIFA game above before adding participants."}
          meta={selectedGame ? `${selectedGame.participants.length} participant${selectedGame.participants.length === 1 ? "" : "s"}` : undefined}
        />
        <Toolbar>
          <Field label="Membership number" hint="Choose a row below or enter a member number.">
            <Input type="number" min={1} list="fifa-member-numbers" value={memberNumber} onChange={(event) => setMemberNumber(event.target.value)} disabled={!selectedGame} />
          </Field>
          <datalist id="fifa-member-numbers">
            {members.map((member) => <option key={member.membership_number} value={member.membership_number}>{member.first_name} {member.last_name}</option>)}
          </datalist>
          <ToolbarActions><Button variant="primary" onClick={() => void addParticipant()} disabled={!selectedGame || saving}>Add participant</Button></ToolbarActions>
        </Toolbar>

        {!selectedGame ? <EmptyState>Select a game to view its participants.</EmptyState> : selectedGame.participants.length === 0 ? <EmptyState>No participants have been logged for this game yet.</EmptyState> : (
          <DataGrid<FIFAGameWithParticipants["participants"][number]>
            rowData={selectedGame.participants}
            columnDefs={participantColumns}
            getRowId={(participant) => String(participant.membership_number)}
          />
        )}
      </ContentCard>

      <ContentCard>
        <CardHeader title="Club members" description="Select a row to copy its membership number into the participant form. Existing FIFA participation is shown for test setup." meta={`${visibleMembers.length} result${visibleMembers.length === 1 ? "" : "s"}`} />
        <div className="assignment-page__search"><Field label="Search members"><Input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ID, name, location, or FIFA game" /></Field></div>
        {visibleMembers.length === 0 ? <EmptyState>No matching members found.</EmptyState> : (
          <DataGrid<FIFAParticipantOverview>
            rowData={visibleMembers}
            columnDefs={memberColumns}
            quickFilterText={search}
            pagination={visibleMembers.length > 20}
            pageSize={20}
            getRowId={(member) => String(member.membership_number)}
            onRowClick={(member) => setMemberNumber(String(member.membership_number))}
          />
        )}
      </ContentCard>
    </PageShell>
  );
}
