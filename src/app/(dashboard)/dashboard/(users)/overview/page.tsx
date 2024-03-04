import AssistCard from "@/components/AssistCard"
import BlockCard from "@/components/BlockCard"
import DashboardBanner from "@/components/DashboardBanner"
import DashboardTopPlayers from "@/components/DashboardTopPlayers"
import PointsCard from "@/components/PointsCard"
import ReboundCard from "@/components/ReboundCard"
import RecentMatches from "@/components/RecentMatches"
import TopTeamCard from "@/components/TopTeamCard"
import UpcomingMatches from "@/components/UpcomingMatches"

const Page = () => {

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] bg-[rgb(20,20,20)] h-screen overflow-y-auto scrollbar-hide">
      {/* GRID 1 */}
      <div className="flex flex-col m-2 space-y-5 mb-[10rem]">
        {/* Banner */}
        <DashboardBanner />

        {/* Top Players */}
        <DashboardTopPlayers />

        {/* Recent Match */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-white text-xl font-semibold">Recent Matches</h1>
          <RecentMatches />
        </div>

        {/* Upcoming Match */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-white text-xl font-semibold">Upcoming Matches</h1>
          <UpcomingMatches />
        </div>
      </div>

      {/* Grid 2 */}
      {/* <div className="hidden lg:flex flex-col mb-[5rem] mt-2 space-y-3">
        <TopTeamCard />
        <PointsCard />
        <AssistCard />
        <ReboundCard />
        <BlockCard />
      </div> */}
    </div>
  )
}

export default Page