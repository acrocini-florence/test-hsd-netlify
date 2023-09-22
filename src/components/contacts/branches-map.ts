export enum Branches {
  HEADQUARTER = "headquarter",
  USA = "usa-branch",
  KOREA = "korea-branch",
  GERMANY = "germany-branch",
  // TODO maybe find a way to disable from contentful
  //TAIWAN = "taiwan-branch",
  SHANGHAI = "shanghai-branch",
}

export const branchesMap = {
  //TODO ask for HQ e-mail
  [Branches.HEADQUARTER]: "servicehsd@hsd.it",
  [Branches.USA]: "service@hsdusa.com",
  [Branches.GERMANY]: "servicehsd@hsd.it",
  [Branches.KOREA]: "Hyunjun.Koo@hsdkorea.kr ",
  //[Branches.TAIWAN]: "service@hsd-china.com",
  [Branches.SHANGHAI]: "service@hsd-china.com",
};

export const branchesList = Object.values(Branches);
