export interface Company {
  id: number;
  name: string;
  code: string;
}

export const fetchSearchSuggestions = async (query: string): Promise<Company[]> => {
  try {
      const response = await fetch(`/api/search?query=${query}`);
      if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
      }
      const data = await response.json();
      console.log('API response data:', data); // デバッグログ
      return data;
  } catch (error) {
      console.error('Error in fetchSearchSuggestions:', error);
      return [];
  }
};
