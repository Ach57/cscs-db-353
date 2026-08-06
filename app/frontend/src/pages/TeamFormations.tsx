import { useState } from "react";
import type { ColDef } from "ag-grid-community";
import RelationPage from "../components/common/relation-page/RelationPage";
import { teamFormationFields } from "../components/common/data-grid/relations/teamFormation.fields";
import { assignPlayer, formationApi, removePlayerAssignment, sessionApi, updatePlayerAssignment } from "../services/formations";
import type { PlayerRole, Session, SessionInput, TeamFormation, TeamFormationInput } from "../types/formation";

const roles: PlayerRole[] = ["Goalkeeper","Right Fullback","Left Fullback","Center Back","Center Back or Sweeper","Defending or Holding Midfielder","Right Midfielder or Winger","Central Midfielder","Striker","Attacking Midfielder","Left Winger"];
const sessionFields: ColDef<Session>[] = [
  { field:"session_id", headerName:"Session ID", editable:false },
  { field:"session_datetime", headerName:"Date and Time", minWidth:190 },
  { field:"address", headerName:"Address", minWidth:220 },
  { field:"session_type", headerName:"Type", cellEditor:"agSelectCellEditor", cellEditorParams:{values:["Training","Game"]} },
];
const toSession=(r:Session):SessionInput=>({session_datetime:r.session_datetime.replace("T"," "),address:r.address.trim(),session_type:r.session_type});
const toFormation=(r:TeamFormation):TeamFormationInput=>({session_id:Number(r.session_id),location_id:Number(r.location_id),head_coach_id:Number(r.head_coach_id),team_name:r.team_name.trim(),...(r.score==null?{}:{score:Number(r.score)}),team_category:r.team_category});

export default function TeamFormations(){
  const [tab,setTab]=useState<"sessions"|"formations"|"assignments">("sessions");
  const [formationId,setFormationId]=useState(""); const [memberId,setMemberId]=useState("");
  const [role,setRole]=useState<PlayerRole>("Goalkeeper"); const [message,setMessage]=useState(""); const [error,setError]=useState("");
  async function action(kind:"add"|"update"|"remove") { setError("");setMessage(""); try { const f=Number(formationId),m=Number(memberId); if(!f||!m) throw new Error("Formation ID and membership number are required."); if(kind==="add") await assignPlayer(f,m,role); else if(kind==="update") await updatePlayerAssignment(f,m,role); else await removePlayerAssignment(f,m); setMessage(kind==="remove"?"Player assignment removed.":`Player assignment ${kind === "add" ? "created" : "updated"}.`); } catch(e){setError(e instanceof Error?e.message:"Assignment failed.");} }
  return <section>
    <div className="page-tabs"><button className={tab==="sessions"?"button button--primary":"button"} onClick={()=>setTab("sessions")}>Sessions</button><button className={tab==="formations"?"button button--primary":"button"} onClick={()=>setTab("formations")}>Team formations</button><button className={tab==="assignments"?"button button--primary":"button"} onClick={()=>setTab("assignments")}>Player assignments</button></div>
    {tab==="sessions" && <RelationPage<Session,SessionInput,Partial<SessionInput>> title="Sessions" description="Create the game or training session first." columnDefs={sessionFields} api={sessionApi} idField="session_id" getRowId={r=>String(r.session_id)} createEmptyRow={()=>({session_id:-Date.now(),session_datetime:new Date().toISOString().slice(0,16).replace("T"," "),address:"",session_type:"Training"})} validateRow={r=>[!r.session_datetime?"Session date/time is required.":"",!r.address.trim()?"Address is required.":""].filter(Boolean)} toCreateInput={toSession} toUpdateInput={toSession}/>} 
    {tab==="formations" && <RelationPage<TeamFormation,TeamFormationInput,Partial<TeamFormationInput>> title="Team Formations" description="Create formations linked to sessions, locations and head coaches." columnDefs={teamFormationFields} api={formationApi} idField="formation_id" getRowId={r=>String(r.formation_id)} createEmptyRow={()=>({formation_id:-Date.now(),session_id:0,location_id:0,head_coach_id:0,team_name:"",score:null,team_category:"Boys"})} validateRow={r=>[r.session_id<=0?"Session ID is required.":"",r.location_id<=0?"Location ID is required.":"",r.head_coach_id<=0?"Head coach ID is required.":"",!r.team_name.trim()?"Team name is required.":""].filter(Boolean)} toCreateInput={toFormation} toUpdateInput={toFormation}/>} 
    {tab==="assignments" && <div className="assignment-panel"><h1>Formation Player Assignment</h1><p>Add, edit or remove a player. Backend integrity rules reject gender, location and less-than-three-hour conflicts.</p><div className="report-controls"><label>Formation ID<input value={formationId} onChange={e=>setFormationId(e.target.value)} inputMode="numeric"/></label><label>Membership number<input value={memberId} onChange={e=>setMemberId(e.target.value)} inputMode="numeric"/></label><label>Role<select value={role} onChange={e=>setRole(e.target.value as PlayerRole)}>{roles.map(r=><option key={r}>{r}</option>)}</select></label><button className="button button--primary" onClick={()=>void action("add")}>Assign</button><button className="button" onClick={()=>void action("update")}>Update role</button><button className="button button--danger" onClick={()=>void action("remove")}>Remove</button></div>{error&&<p className="relation-page__status relation-page__status--error">{error}</p>}{message&&<p className="relation-page__status">{message}</p>}</div>}
  </section>;
}
