import { CalendarIcon } from "lucide-react"
import FeatureComponent from "./FeatureComponent"
import MaxWidthWrapper from "./MaxWidthWrapper"

const CoreFeatures = () => {
  return (
    <MaxWidthWrapper className="flex flex-col mt-10">

      <div className="max-w-lg">
        <h1 className="text-gradient2 uppercase font-bold text-3xl mb-2">Our Core Features</h1>
        <h1 className="uppercase text-2xl font-semibold mb-3">
          Empowering Recruiters and coaches with cutting-edge 
          <span className="text-gradient2"> scouting tools</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-3 mb-5 gap-y-5 place-items-center lg:place-items-start">
         <FeatureComponent 
            iconSrc='/icon1.png'
            title="Rankings"
            paragraph="Our rankings are a reflection of talent, 
            hardwork and dedication. We meticulously evaluate player performances in leagues, 
            tournaments and combines to identify the best of the best. With our ranking system."
          />

          <FeatureComponent 
            iconSrc='/icon2.png'
            title="Detailed Player Profiles"
            paragraph="We understand that every player has a unique journey and a story to tell.
            Our detailed player profiles go beyond statistics; they're a window into the world
            of aspiring basketball stars."
          />

          <FeatureComponent 
            iconSrc='/icon3.png'
            title="Performance Tracking"
            paragraph="We take basketball scouting to the next level with our cutting-edge performance
            tracking tools. We understand that success in the game relies on more than just talent."
          />
      </div>

      <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 mt-3 gap-y-3">
         <FeatureComponent 
            iconSrc='/icon4.png'
            title="Event and Tournament Information"
            paragraph="We are your gateway to the heart of African basketball action.
            Our platform provides the most up-to-date event and tournament information,
            giving you an edge in the world of scouting and recruitment."
          />

          <FeatureComponent 
            iconSrc='/icon5.png'
            title="Real-Time Game Data"
            paragraph="We are dedicated to providing you with the most accurate and up-to-the-minute
            insights into the world of basketball. Our real-time game data feature is your key to staying ahead
            of the curve in scouting, coaching and player development."
          />

          <FeatureComponent 
            iconSrc='/icon6.png'
            title="Messaging and Communication"
            paragraph="We are your gateway to the heart of african basketball action. Our platform
            provides the most up-to-date event and tournament information, giving you an edge in the world
            of scouting and recruitment."
          />
      </div>
    </MaxWidthWrapper>
  )
}

export default CoreFeatures