import { PrismaClient } from '@prisma/client';
import { DEFAULT_THANK_YOU_TEMPLATES } from './email/templates';

const prisma = new PrismaClient();

export async function seedThankYouTemplates() {
  try {
    // Check if templates already exist
    const existingTemplates = await prisma.thankYouTemplate.count();
    if (existingTemplates > 0) {
      console.log('Thank-You templates already exist, skipping seed');
      return;
    }

    // Create default templates
    for (const template of DEFAULT_THANK_YOU_TEMPLATES) {
      await prisma.thankYouTemplate.create({
        data: {
          name: template.name,
          slug: template.slug,
          html: template.html,
          thumbnailUrl: null, // Will be generated later
        },
      });
    }

    console.log(`Created ${DEFAULT_THANK_YOU_TEMPLATES.length} Thank-You templates`);
  } catch (error) {
    console.error('Error seeding Thank-You templates:', error);
  }
}
