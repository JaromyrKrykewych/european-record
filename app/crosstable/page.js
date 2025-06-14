import GlobalHeadToHeadTable from "@/components/CrossTable";
import { crossTeams } from "@/data/selectedTeams";
import filterTeamsData from "@/lib/filterTeamsData";
import getTeamsFromJson from "@/lib/getTeamsFromJson";

export default function Home() {
  const teamsData = getTeamsFromJson();
  const teamsNames = crossTeams.map((team) => team.name);
  const selectedTeams = filterTeamsData(teamsData, teamsNames);
  return (
    <>
      <h1 className="text-xl font-bold mt-12 mb-8">
        Tabla Global de Enfrentamientos
      </h1>
      <GlobalHeadToHeadTable data={selectedTeams} teams={crossTeams} />
    </>
  );
}
