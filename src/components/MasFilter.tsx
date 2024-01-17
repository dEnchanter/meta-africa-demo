import { useState } from "react";
import { PopoverContent } from "./ui/popover";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

// interface MasFilterProps {
//   showPositionInput: boolean;
//   setShowPositionInput: (value: boolean) => void;
//   showHeightInput: boolean;
//   setShowHeightInput: (value: boolean) => void;
//   showWeightInput: boolean;
//   setShowWeightInput: (value: boolean) => void;
//   showScoutGradeInput: boolean;
//   setShowScoutGradeInput: (value: boolean) => void;
//   showAvgTotalPointInput: boolean;
//   setShowAvgTotalPointInput: (value: boolean) => void;
//   showAvgBlockInput: boolean;
//   setShowAvgBlockInput: (value: boolean) => void;
//   showAvgReboundInput: boolean;
//   setShowAvgReboundInput: (value: boolean) => void;
//   showAvgAssistInput: boolean;
//   setShowAvgAssistInput: (value: boolean) => void;
// }

interface Filter {
  key: string;
  value: string;
}

interface MasFilterProps {
  filters: Filter[];
  setFilters: React.Dispatch<React.SetStateAction<Filter[]>>;
  closePopover: () => void;
}

const MasFilter = ({
  filters,
  setFilters,
  closePopover
}: MasFilterProps) => {

  const [showPositionInput, setShowPositionInput] = useState<boolean>(false);
  const [showHeightInput, setShowHeightInput] = useState<boolean>(false);
  const [showWeightInput, setShowWeightInput] = useState<boolean>(false);
  const [showScoutGradeInput, setShowScoutGradeInput] = useState<boolean>(false);
  const [showAvgTotalPointInput, setShowAvgTotalPointInput] = useState<boolean>(false);
  const [showAvgBlockInput, setShowAvgBlockInput] = useState<boolean>(false);
  const [showAvgReboundInput, setShowAvgReboundInput] = useState<boolean>(false);
  const [showAvgAssistInput, setShowAvgAssistInput] = useState<boolean>(false);

  const [position, setPosition] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [scoutGrade, setScoutGrade] = useState("");
  const [point, setPoint] = useState("");
  const [rebound, setRebound] = useState("");
  const [block, setBlock] = useState("");
  const [assist, setAssist] = useState("");

  const handlePositionCheckboxChange = () => {
    setShowPositionInput(!showPositionInput);
  };

  const handleHeightCheckboxChange = () => {
    setShowHeightInput(!showHeightInput);
  };

  const handleWeightCheckboxChange = () => {
    setShowWeightInput(!showWeightInput);
  };

  const handleSGCheckboxChange = () => {
    setShowScoutGradeInput(!showScoutGradeInput);
  };

  const handleATPCheckboxChange = () => {
    setShowAvgTotalPointInput(!showAvgTotalPointInput);
  };

  const handleABCheckboxChange = () => {
    setShowAvgBlockInput(!showAvgBlockInput);
  };

  const handleARCheckboxChange = () => {
    setShowAvgReboundInput(!showAvgReboundInput);
  };

  const handleAACheckboxChange = () => {
    setShowAvgAssistInput(!showAvgAssistInput);
  };

  const handleFilterSubmit = () => {
    // Create a new filters array based on the input values
    const newFilters = [];
    if (showPositionInput && position) {
      newFilters.push({ key: 'position', value: position });
    }

    // Add other filters similarly
    // ...
    if (showHeightInput && height) {
      newFilters.push({ key: 'height', value: height });
    }

    if (showWeightInput && weight) {
      newFilters.push({ key: 'weight', value: weight });
    }

    if (showScoutGradeInput && scoutGrade) {
      newFilters.push({ key: 'scout_grade', value: scoutGrade });
    }

    if (showAvgTotalPointInput && point) {
      newFilters.push({ key: 'avg_total_points', value: point });
    }

    if (showAvgBlockInput && block) {
      newFilters.push({ key: 'avg_blocks', value: block });
    }

    if (showAvgReboundInput && rebound) {
      newFilters.push({ key: 'avg_rebounds', value: rebound });
    }

    if (showAvgAssistInput && assist) {
      newFilters.push({ key: 'avg_assists', value: assist });
    }
  
    // Update the filters state
    setFilters(newFilters);

    // Close the popover
    closePopover();
  };

  const handleCancel = () => {
    closePopover();
  }

  return (
    <PopoverContent className="w-[27rem]">
      <div className="flex flex-col space-y-4">
        <div className="space-y-1">
          <h4 className="font-medium leading-none">Filter Options</h4>
          <p className="text-sm text-muted-foreground">
            Select the fields you want to display.
          </p>
        </div>
        <div className="space-y-2">

          <label className="flex items-center space-x-1 justify-between">
            <div className="flex items-center space-x-1">
              <span>
                <input
                  type="checkbox"
                  className="h-5 w-5 text-gray-500 border-2 border-gray-400 rounded-md"
                  checked={showPositionInput}
                  onChange={handlePositionCheckboxChange}
                />
              </span>
              <span className="font-medium italic">Position</span>
            </div>  
            {showPositionInput && 
              <Input 
              className="w-[15rem]" 
              value={position}
              onChange={e => setPosition(e.target.value)} 
              />
            }
          </label>

          <label className="flex items-center space-x-1 justify-between">
            <div className="flex items-center space-x-1">
              <span>
                <input
                  type="checkbox"
                  className="h-5 w-5 text-gray-500 border-2 border-gray-400 rounded-md"
                  checked={showHeightInput}
                  onChange={handleHeightCheckboxChange}
                />
              </span>
              <span className="font-medium italic">Height</span>
            </div>
            {showHeightInput && 
              <Input 
              className="w-[15rem]" 
              value={height}
              onChange={e => setHeight(e.target.value)} 
              />
            }
          </label>

          <label className="flex items-center space-x-1 justify-between">
            <div className="flex items-center space-x-1">
              <span>
                <input
                  type="checkbox"
                  className="h-5 w-5 border-2 border-gray-400 rounded-md 
                  checked:border-transparent focus:outline-none"
                  checked={showWeightInput}
                  onChange={handleWeightCheckboxChange}
                />
              </span>
              <span className="font-medium italic">Weight</span>
            </div>
            {showWeightInput && 
              <Input 
              className="w-[15rem]" 
              value={weight}
              onChange={e => setWeight(e.target.value)} 
              />
            }
          </label>

          <label className="flex items-center space-x-1 justify-between">
            <div className="flex items-center space-x-1">
              <span>
                <input
                  type="checkbox"
                  className="h-5 w-5 border-2 border-gray-400 rounded-md 
                  checked:border-transparent focus:outline-none"
                  checked={showScoutGradeInput}
                  onChange={handleSGCheckboxChange}
                />
              </span>
              <span className="font-medium italic">Scout Grade</span>
            </div>
            {showScoutGradeInput && 
              <Input 
              className="w-[15rem]" 
              value={scoutGrade}
              onChange={e => setScoutGrade(e.target.value)} 
              />
            }
          </label>

          <label className="flex items-center space-x-1 justify-between">
            <div className="flex items-center space-x-1">
              <span>
                <input
                  type="checkbox"
                  className="h-5 w-5 border-2 border-gray-400 rounded-md 
                  checked:border-transparent focus:outline-none"
                  checked={showAvgTotalPointInput}
                  onChange={handleATPCheckboxChange}
                />
              </span>
              <span className="font-medium italic">Avg Total Points</span>
            </div>
            {showAvgTotalPointInput && 
              <Input 
              className="w-[15rem]" 
              value={point}
              onChange={e => setPoint(e.target.value)} 
              />
            }
          </label>

          <label className="flex items-center space-x-1 justify-between">
            <div className="flex items-center space-x-1">
              <span>
                <input
                  type="checkbox"
                  className="h-5 w-5 border-2 border-gray-400 rounded-md 
                  checked:border-transparent focus:outline-none"
                  checked={showAvgBlockInput}
                  onChange={handleABCheckboxChange}
                />
              </span>
              <span className="font-medium italic">Avg Blocks</span>
            </div>
            {showAvgBlockInput && 
              <Input 
              className="w-[15rem]" 
              value={block}
              onChange={e => setBlock(e.target.value)} 
              />
            }
          </label>

          <label className="flex items-center space-x-1 justify-between">
            <div className="flex items-center space-x-1">
              <span>
                <input
                  type="checkbox"
                  className="h-5 w-5 border-2 border-gray-400 rounded-md 
                  checked:border-transparent focus:outline-none"
                  checked={showAvgReboundInput}
                  onChange={handleARCheckboxChange}
                />
              </span>
              <span className="font-medium italic">Avg Rebounds</span>
            </div>
            {showAvgReboundInput && 
              <Input 
              className="w-[15rem]" 
              value={rebound}
              onChange={e => setRebound(e.target.value)} 
              />
            }
          </label>

          <label className="flex items-center space-x-1 justify-between">
            <div className="flex items-center space-x-1">
              <span>
                <input
                  type="checkbox"
                  className="h-5 w-5 border-2 border-gray-400 rounded-md 
                  checked:border-transparent focus:outline-none"
                  checked={showAvgAssistInput}
                  onChange={handleAACheckboxChange}
                />
              </span>
              <span className="font-medium italic">Avg Assists</span>
            </div>
            {showAvgAssistInput && 
              <Input 
              className="w-[15rem]" 
              value={assist}
              onChange={e => setAssist(e.target.value)} 
              />
            }
          </label>

          <div className="flex justify-end">
            <Button onClick={handleCancel} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-4 rounded mr-2 w-[7rem]">
              Cancel
            </Button>
            <Button onClick={handleFilterSubmit}   className="bg-orange-600/90 hover:bg-orange-700/90 text-white font-bold py-3 px-4 rounded w-[7rem]">
              Filter
            </Button>
          </div>
        </div>
      </div>
    </PopoverContent>
  )
}

export default MasFilter