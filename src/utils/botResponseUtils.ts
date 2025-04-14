/**
 * Get bot response from the API
 */
export const getBotResponse = async (userMessage: string): Promise<string> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_CHAT_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        queryapi: userMessage,
        n_chunks: parseInt(process.env.NEXT_PUBLIC_DEFAULT_CHUNKS || '15'),
        modelName: process.env.NEXT_PUBLIC_DEFAULT_MODEL || 'Llama3.1',
        streaming: parseInt(process.env.NEXT_PUBLIC_DEFAULT_STREAMING || '1'),
        audience: process.env.NEXT_PUBLIC_DEFAULT_AUDIENCE || 'Particuliers',
        reformulation: true
      })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch response');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error fetching bot response:', error);
    return "Désolé, une erreur est survenue. Veuillez réessayer.";
  }
};
