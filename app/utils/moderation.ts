/**
 * Check listing content against OpenAI moderation API
 * Ensures content is in English and contains no derogatory language
 */
export async function moderateListingContent(
  title: string,
  description: string
): Promise<{
  flagged: boolean;
  reason?: string;
  message: string;
}> {
  try {
    const response = await fetch('/api/moderation/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Moderation check failed');
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Moderation error:', error);
    throw error;
  }
}
