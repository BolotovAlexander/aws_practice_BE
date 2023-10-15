export interface IProduct {
    description: string;
    id: string;
    price: number;
    title: string;
    imgUrl: string;
    count: number;
  }
  
  export type TProducts = IProduct[];