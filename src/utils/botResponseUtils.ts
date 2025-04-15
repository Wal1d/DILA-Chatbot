/**
 * Get bot response from the API
 */
export const getBotResponse = async (userMessage: string, reformulation : boolean): Promise<{ answer, context, query }> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_CHAT_ENDPOINT}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          queryapi: userMessage,
          n_chunks: parseInt(import.meta.env.VITE_DEFAULT_CHUNKS || '15'),
          modelName: import.meta.env.VITE_DEFAULT_MODEL || 'Llama3.1',
          streaming: parseInt(import.meta.env.VITE_DEFAULT_STREAMING || '1'),
          audience: import.meta.env.VITE_DEFAULT_AUDIENCE || 'Particuliers',
          reformulation: reformulation ?? true
        })
      }
    );


    if (!response.ok) {
      throw new Error('Failed to fetch response');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching bot response:', error);
    return { answer:"Désolé, une erreur est survenue. Veuillez réessayer.", context: [], query: "" }
  }
};
