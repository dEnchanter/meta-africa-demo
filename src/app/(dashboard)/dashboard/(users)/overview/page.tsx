import AssistCard from "@/components/AssistCard"
import DashboardBanner from "@/components/DashboardBanner"
import DashboardTopPlayers from "@/components/DashboardTopPlayers"
import PointsCard from "@/components/PointsCard"
import ReboundCard from "@/components/ReboundCard"
import TopTeamCard from "@/components/TopTeamCard"
import Image from "next/image"


const Page = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] bg-[rgb(20,20,20)] h-screen overflow-y-auto scrollbar-hide">
      {/* GRID 1 */}
      <div className="flex flex-col m-2 space-y-5">
        {/* Banner */}
        <DashboardBanner />

        {/* Top Players */}
        <DashboardTopPlayers />

        {/* Recent Match */}
        <div></div>

        {/* Upcoming Match */}
        <div></div>
      </div>

      {/* Grid 2 */}
      <div className="hidden lg:flex flex-col m-2 space-y-3">
        <TopTeamCard />
        <PointsCard />
        <AssistCard />
        <ReboundCard />


      </div>
    </div>
  )
}

export default Page