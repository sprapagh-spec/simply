export interface ThankYouVariables {
  first_name: string;
  full_name: string;
  gift_amount: string;
  gift_note?: string;
  wedding_name?: string;
  couple_name?: string;
  [key: string]: string | undefined;
}

export function renderThankYouHtml(templateHtml: string, variables: ThankYouVariables): string {
  let rendered = templateHtml;
  
  // Replace all merge tags with actual values
  Object.entries(variables).forEach(([key, value]) => {
    if (value !== undefined) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      rendered = rendered.replace(regex, value);
    }
  });

  // Remove any remaining unreplaced merge tags
  rendered = rendered.replace(/{{[^}]+}}/g, '');

  return rendered;
}

export function getDefaultThankYouVariables(guestName: string, giftAmount: string, giftNote?: string): ThankYouVariables {
  return {
    first_name: guestName.split(' ')[0] || guestName,
    full_name: guestName,
    gift_amount: giftAmount,
    gift_note: giftNote || '',
    wedding_name: 'Our Wedding',
    couple_name: 'Sarah & Michael',
  };
}
