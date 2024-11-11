export interface StatusDto {
  post: string;
  user: {
    firstName: string;
    lastName: string;
    alias: string;
    imageUrl: string;
  };
  timestamp: number; 
  segments: {
    text: string;
    startPosition: number;
    endPosition: number;
    type: string;
  }[];
}
