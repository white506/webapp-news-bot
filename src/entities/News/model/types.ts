export interface News {
  id: string;
  title: string;
  text: string;
  imageUrl: string;
  createdAt: string;
}

export interface NewsState {
  data: News | null;
  isLoading: boolean;
  error: string | null;
} 