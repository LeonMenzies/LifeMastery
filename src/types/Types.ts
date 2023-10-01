export type actionItemT = {
  key: string;
  action: string;
  isCompleted: boolean;
  timeEstimate: string;
  priority: number;
  areaOfImportance: string;
  dateAdded: Date;
};

export type AreaOfImportanceItemT = {
  key: string;
  AOI: string;
  Color: string;
};

export type PlanT = {
  key: string;
  date: Date;
  focus: string;
  finalized: boolean;
  actionItems: actionItemT[];
};
