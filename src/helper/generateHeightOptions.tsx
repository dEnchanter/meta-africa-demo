export const generateHeightOptions = () => {
  const options = [];
  for (let feet = 4; feet <= 7; feet++) {
    for (let inch = 0; inch <= 11; inch++) {
      options.push({
        value: `${feet}'${inch}"`, // or convert it to inches or other formats you need
        label: `${feet}ft ${inch}`,
      });
    }
  }
  return options;
};