export interface WheelItem {
  id: string;
  label: string;
  color: string;
}

export interface SpinResult {
  winner: WheelItem;
  rotation: number;
}

export interface WinnerRecord {
  id: string; // Unique ID for the history record
  item: WheelItem;
  timestamp: Date;
  batchId: string; // To group winners picked at the same time
}