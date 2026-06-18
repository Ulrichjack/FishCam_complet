export interface UserResponse {
  id:number;
  phone:string;
  firstName:string;
  lastName:string;
  role: 'SUPER_ADMIN' | 'PATRON' | 'CAISSIERE' | 'ENREGISTREUR';
  scope: UserScope; 
  poissonnerieId: number | null; 
  poissonnerieName: string | null;
  active:boolean;
}


export enum UserScope { 
  MULTI_POISSONNERIE = 'MULTI_POISSONNERIE',
  //SINGLE_POISSONNERIE = 'SINGLE_POISSONNERIE'
}