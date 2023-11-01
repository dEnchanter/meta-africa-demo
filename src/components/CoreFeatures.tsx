import { CalendarIcon } from "lucide-react"
import FeatureComponent from "./FeatureComponent"
import MaxWidthWrapper from "./MaxWidthWrapper"

const CoreFeatures = () => {
  return (
    <MaxWidthWrapper className="flex flex-col mt-10">

      <div className="max-w-lg">
        <h1 className="text-red-500 uppercase font-semibold text-xl mb-2">Our Core Features</h1>
        <h1 className="uppercase text-2xl font-semibold mb-3">
          Empowering Recruiters and coaches with cutting-edge 
          <span className="text-red-500"> scouting tools</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-3 mb-5 gap-y-5 place-items-center lg:place-items-start">
         <FeatureComponent 
            icon={
              <CalendarIcon 
                color="#FFA500"
              />
            }
            title="Rankings"
            paragraph="Our rankings are a reflection of talent, 
            hardwork and dedication. We meticulously evaluate player performances in leagues, 
            tournaments and combines to identify the best of the best. With our ranking system"
          />

          <FeatureComponent 
            icon={
              <CalendarIcon 
                color="#FFA500"
              />
            }
            title="Rankings"
            paragraph="Our rankings are a reflection of talent, 
            hardwork and dedication. We meticulously evaluate player performances in leagues, 
            tournaments and combines to identify the best of the best. With our ranking system"
          />

          <FeatureComponent 
            icon={
              <CalendarIcon 
                color="#FFA500"
              />
            }
            title="Rankings"
            paragraph="Our rankings are a reflection of talent, 
            hardwork and dedication. We meticulously evaluate player performances in leagues, 
            tournaments and combines to identify the best of the best. With our ranking system"
          />
      </div>

      <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 mt-3 gap-y-3">
         <FeatureComponent 
            icon={
              <CalendarIcon 
                color="#FFA500"
              />
            }
            title="Rankings"
            paragraph="Our rankings are a reflection of talent, 
            hardwork and dedication. We meticulously evaluate player performances in leagues, 
            tournaments and combines to identify the best of the best. With our ranking system"
          />

          <FeatureComponent 
            icon={
              <CalendarIcon 
                color="#FFA500"
              />
            }
            title="Rankings"
            paragraph="Our rankings are a reflection of talent, 
            hardwork and dedication. We meticulously evaluate player performances in leagues, 
            tournaments and combines to identify the best of the best. With our ranking system"
          />

          <FeatureComponent 
            icon={
              <CalendarIcon 
                color="#FFA500"
              />
            }
            title="Rankings"
            paragraph="Our rankings are a reflection of talent, 
            hardwork and dedication. We meticulously evaluate player performances in leagues, 
            tournaments and combines to identify the best of the best. With our ranking system"
          />
      </div>
    </MaxWidthWrapper>
  )
}

export default CoreFeatures