export interface MissionType {
  missionId: string;
  name: string;
  completed: boolean;
  myValue: number;
  requireValue: number;
  expReward: number;
}

export interface ExpResultType {
  exp: number;
  level: number;
  levelUpdated: boolean;
  prevExp: number;
  expReward: number;
  missionName: string;
}
