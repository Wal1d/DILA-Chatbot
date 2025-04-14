
/**
 * Simulated bot response - in a real app, this would be replaced by an API call
 */
export const getBotResponse = (userMessage: string): string => {
  if (userMessage.toLowerCase().includes('bonjour') || userMessage.toLowerCase().includes('salut')) {
    return "Bonjour ! Comment puis-je vous aider aujourd'hui ?";
  }
  
  if (userMessage.toLowerCase().includes('merci')) {
    return "Je vous en prie. Y a-t-il autre chose que je peux faire pour vous ?";
  }
  
  if (userMessage.toLowerCase().includes('carte d\'identité') || userMessage.toLowerCase().includes('passeport')) {
    return "Pour les questions concernant les cartes d'identité et les passeports, je vous invite à consulter le site service-public.fr ou à contacter votre mairie. Vous avez besoin de formulaires spécifiques et de pièces justificatives.";
  }
  
  if (userMessage.toLowerCase().includes('impôt') || userMessage.toLowerCase().includes('taxe')) {
    return "Pour les questions fiscales, je vous recommande de consulter le site impots.gouv.fr ou de contacter votre centre des finances publiques local. Vous pourrez y trouver des informations sur les déclarations, les paiements et les déductions fiscales.";
  }
  
  if (userMessage.toLowerCase().includes('reformuler')) {
    return "Je vais essayer de reformuler votre demande. Pourriez-vous me préciser quel aspect vous souhaitez que je reformule ?";
  }

  return "Merci pour votre question. Pour obtenir des informations précises sur ce sujet, je vous invite à consulter le site service-public.fr ou à contacter directement le service administratif concerné. Avez-vous besoin d'autres renseignements ?";
};
