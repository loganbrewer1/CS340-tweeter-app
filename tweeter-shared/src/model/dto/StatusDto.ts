export interface StatusDto {
  readonly post: string;
  readonly user: {
    firstName: string;
    lastName: string;
    alias: string;
    imageUrl: string;
  };
  readonly timestamp: number; 
  readonly segments: {
    text: string;
    startPosition: number;
    endPosition: number;
    type: string;
  }[];
}
