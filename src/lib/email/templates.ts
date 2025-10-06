export const DEFAULT_THANK_YOU_TEMPLATES = [
  {
    name: "Minimal Ivory",
    slug: "minimal-ivory",
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: 'Open Sans', Arial, sans-serif; background: #FFFBF6; padding: 40px 20px;">
        <div style="background: #FFFFFF; border: 1px solid #E3ECE6; border-radius: 16px; padding: 40px; text-align: center;">
          <div style="border-top: 3px solid #7FA28A; width: 60px; margin: 0 auto 30px;"></div>
          <h1 style="color: #1F2937; font-size: 28px; font-weight: 700; margin: 0 0 20px; letter-spacing: -0.025em;">Thank You, {{first_name}}!</h1>
          <p style="color: #6B7280; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
            Your generous gift of {{gift_amount}} means the world to us. 
            {{#if gift_note}}Your thoughtful note, "{{gift_note}}", brought us so much joy.{{/if}}
          </p>
          <p style="color: #6B7280; font-size: 16px; line-height: 1.6; margin: 0;">
            With love and gratitude,<br>
            <strong style="color: #1F2937;">{{couple_name}}</strong>
          </p>
        </div>
      </div>
    `,
  },
  {
    name: "Blush Frame",
    slug: "blush-frame",
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: 'Open Sans', Arial, sans-serif; background: #FFFBF6; padding: 40px 20px;">
        <div style="background: #FFFFFF; border: 2px solid #F4DAD9; border-radius: 16px; padding: 40px; text-align: center; position: relative;">
          <div style="position: absolute; top: -1px; left: -1px; right: -1px; height: 4px; background: linear-gradient(90deg, #F4DAD9, #E3ECE6, #F4DAD9); border-radius: 16px 16px 0 0;"></div>
          <h1 style="color: #1F2937; font-size: 32px; font-weight: 700; margin: 20px 0 25px; letter-spacing: -0.025em; font-family: Georgia, serif;">Dear {{first_name}}</h1>
          <p style="color: #6B7280; font-size: 18px; line-height: 1.7; margin: 0 0 25px;">
            We are overwhelmed by your kindness and the beautiful gift of {{gift_amount}}.
            {{#if gift_note}}Your words, "{{gift_note}}", touched our hearts deeply.{{/if}}
          </p>
          <p style="color: #6B7280; font-size: 16px; line-height: 1.6; margin: 0;">
            Thank you for being part of our special day.<br>
            <em style="color: #7FA28A;">{{couple_name}}</em>
          </p>
        </div>
      </div>
    `,
  },
  {
    name: "Sage Leafline",
    slug: "sage-leafline",
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: 'Open Sans', Arial, sans-serif; background: #FFFBF6; padding: 40px 20px;">
        <div style="background: #FFFFFF; border-radius: 16px; padding: 40px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <div style="margin-bottom: 30px;">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style="margin: 0 auto; color: #7FA28A;">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
            </svg>
          </div>
          <h1 style="color: #1F2937; font-size: 30px; font-weight: 700; margin: 0 0 20px; letter-spacing: -0.025em;">Thank You, {{first_name}}!</h1>
          <p style="color: #6B7280; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
            Your thoughtful gift of {{gift_amount}} has filled our hearts with gratitude.
            {{#if gift_note}}We especially loved your message: "{{gift_note}}".{{/if}}
          </p>
          <p style="color: #6B7280; font-size: 16px; line-height: 1.6; margin: 0;">
            With warmest thanks,<br>
            <strong style="color: #7FA28A;">{{couple_name}}</strong>
          </p>
        </div>
      </div>
    `,
  },
  {
    name: "Photo Header",
    slug: "photo-header",
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: 'Open Sans', Arial, sans-serif; background: #FFFBF6; padding: 40px 20px;">
        <div style="background: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <div style="height: 200px; background: linear-gradient(135deg, #7FA28A, #F4DAD9); display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: 700;">
            📸 Photo Placeholder
          </div>
          <div style="padding: 40px; text-align: center;">
            <h1 style="color: #1F2937; font-size: 28px; font-weight: 700; margin: 0 0 20px; letter-spacing: -0.025em;">Thank You, {{first_name}}!</h1>
            <p style="color: #6B7280; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
              Your generous gift of {{gift_amount}} means everything to us.
              {{#if gift_note}}Your note, "{{gift_note}}", made us smile.{{/if}}
            </p>
            <p style="color: #6B7280; font-size: 16px; line-height: 1.6; margin: 0;">
              With love,<br>
              <strong style="color: #1F2937;">{{couple_name}}</strong>
            </p>
          </div>
        </div>
      </div>
    `,
  },
  {
    name: "Modern Monogram",
    slug: "modern-monogram",
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: 'Open Sans', Arial, sans-serif; background: #FFFBF6; padding: 40px 20px;">
        <div style="background: #FFFFFF; border-radius: 16px; padding: 40px; text-align: center;">
          <div style="width: 80px; height: 80px; background: #7FA28A; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 30px; color: white; font-size: 32px; font-weight: 700; letter-spacing: 2px;">
            {{couple_name}}
          </div>
          <h1 style="color: #1F2937; font-size: 24px; font-weight: 600; margin: 0 0 20px; letter-spacing: -0.025em;">Thank You, {{first_name}}</h1>
          <p style="color: #6B7280; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
            We're so grateful for your gift of {{gift_amount}}.
            {{#if gift_note}}Your message, "{{gift_note}}", was beautiful.{{/if}}
          </p>
          <p style="color: #6B7280; font-size: 14px; line-height: 1.5; margin: 0;">
            With appreciation,<br>
            <strong style="color: #7FA28A;">{{couple_name}}</strong>
          </p>
        </div>
      </div>
    `,
  },
  {
    name: "Ribbon Divider",
    slug: "ribbon-divider",
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: 'Open Sans', Arial, sans-serif; background: #FFFBF6; padding: 40px 20px;">
        <div style="background: #FFFFFF; border-radius: 16px; padding: 40px; text-align: center; position: relative;">
          <div style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 100px; height: 4px; background: linear-gradient(90deg, #F59E0B, #F4DAD9, #F59E0B); border-radius: 0 0 8px 8px;"></div>
          <h1 style="color: #1F2937; font-size: 30px; font-weight: 700; margin: 30px 0 20px; letter-spacing: -0.025em;">Thank You, {{first_name}}!</h1>
          <p style="color: #6B7280; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
            Your generous gift of {{gift_amount}} has touched our hearts.
            {{#if gift_note}}We treasure your words: "{{gift_note}}".{{/if}}
          </p>
          <p style="color: #6B7280; font-size: 16px; line-height: 1.6; margin: 0;">
            With heartfelt thanks,<br>
            <strong style="color: #1F2937;">{{couple_name}}</strong>
          </p>
        </div>
      </div>
    `,
  },
];
