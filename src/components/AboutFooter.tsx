
const AboutFooter = () => {
  return (
    <div className="flex flex-col justify-center items-center p-[4rem] space-y-5">
      <div className="flex flex-col justify-center items-center space-y-1">
        <h1 className="text-3xl font-semibold uppercase">Some Count That Matters</h1>
        <p className="font-light text-md">Our achievement in the journey depicted in numbers</p>
      </div>
      <div className="grid grid-cols-3 max-w-md gap-x-5">
        <div className="flex flex-col items-center space-y-1">
          <h1 className="text-orange-400 text-5xl font-bold">1000+</h1>
          <p className="font-medium text-sm">Basketball Players</p>
        </div>
        <div className="flex flex-col items-center space-y-1">
          <h1 className="text-orange-400 text-5xl font-bold">20+</h1>
          <p className="font-medium text-sm">Leagues</p>
        </div>
        <div className="flex flex-col items-center space-y-1">
          <h1 className="text-orange-400 text-5xl font-bold">10</h1>
          <p className="font-medium text-sm">Africa Countries</p>
        </div>
      </div>
    </div>
  )
}

export default AboutFooter