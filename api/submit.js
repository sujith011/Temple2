/**
 * Serverless API Function: /api/submit
 * Handles form submissions for Pooja requests, Donations, and Inquiries.
 * 1. Stores data in Supabase PostgreSQL database
 * 2. Dispatches notification email to Temple Admin via Resend
 * 3. Sends instant "Received" auto-reply email to the Devotee via Resend
 */

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, data } = req.body || {};

  if (!type || !data) {
    return res.status(400).json({ error: 'Missing submission payload' });
  }

  let rawUrl = (process.env.SUPABASE_URL || '').trim().replace(/\/+$/, '');
  const matchDashboard = rawUrl.match(/supabase\.com\/dashboard\/project\/([a-zA-Z0-9_-]+)/i);
  if (matchDashboard) {
    rawUrl = `https://${matchDashboard[1]}.supabase.co`;
  }
  const SUPABASE_URL = rawUrl.replace(/\/rest\/v1\/?$/i, '');
  const SUPABASE_ANON_KEY = (process.env.SUPABASE_ANON_KEY || '').trim();
  const RESEND_API_KEY = (process.env.RESEND_API_KEY || '').trim();
  const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || process.env.OWNER_EMAIL || '').trim();

  let dbResult = { status: 'skipped', reason: 'Missing SUPABASE_URL or SUPABASE_ANON_KEY' };

  try {
    // -------------------------------------------------------------
    // 1. SAVE INTO SUPABASE DATABASE
    // -------------------------------------------------------------
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      let tableName = 'inquiries';
      let dbRecord = {};

      if (type === 'pooja') {
        tableName = 'pooja_requests';
        dbRecord = {
          name: data.name || '',
          star: data.star || null,
          phone: data.phone || '',
          email: data.email || null,
          offering: data.offering || 'General',
          preferred_date: data.date || null,
          persons: data.persons ? parseInt(data.persons, 10) : 1,
          notes: data.notes || null,
          status: 'pending'
        };
      } else if (type === 'donate') {
        tableName = 'donation_pledges';
        dbRecord = {
          name: data.name || '',
          phone: data.phone || '',
          email: data.email || null,
          cause: data.cause || 'General',
          amount: data.amount ? parseFloat(data.amount) : 0,
          note: data.note || null,
          status: 'pending'
        };
      } else {
        tableName = 'inquiries';
        dbRecord = {
          name: data.name || '',
          contact: data.contact || '',
          message: data.message || '',
          status: 'pending'
        };
      }

      const endpoint = `${SUPABASE_URL}/rest/v1/${tableName}`;

      const dbResponse = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(dbRecord)
      });

      if (!dbResponse.ok) {
        const errorText = await dbResponse.text();
        dbResult = { status: 'error', code: dbResponse.status, endpoint: endpoint, error: errorText };
        console.error('Supabase DB Insert Error:', errorText);
      } else {
        const row = await dbResponse.json().catch(() => null);
        dbResult = { status: 'success', endpoint: endpoint, row: row };
      }
    }

    // -------------------------------------------------------------
    // 2. DISPATCH EMAILS VIA RESEND
    // -------------------------------------------------------------
    if (RESEND_API_KEY) {
      // Form titles & subject lines
      const titles = {
        pooja: 'New Pooja / Vazhipadu Booking Request',
        donate: 'New Donation Pledge Received',
        inquiry: 'New Devotee Message / Inquiry'
      };

      const title = titles[type] || 'New Website Request';
      const subject = `[Kodungallur Temple] ${title} - ${data.name || 'Devotee'}`;

      // Build HTML detail table for Admin
      const adminHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
          <h2 style="color: #6b1d1d; border-bottom: 2px solid #e2c069; padding-bottom: 8px;">${title}</h2>
          <p>A new form submission has been recorded on the temple website:</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            ${data.name ? `<tr><td style="padding: 8px; border: 1px solid #ddd; background: #fafafa; font-weight: bold; width: 35%;">Name</td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.name)}</td></tr>` : ''}
            ${data.star ? `<tr><td style="padding: 8px; border: 1px solid #ddd; background: #fafafa; font-weight: bold;">Star (Nakshatra)</td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.star)}</td></tr>` : ''}
            ${data.phone ? `<tr><td style="padding: 8px; border: 1px solid #ddd; background: #fafafa; font-weight: bold;">Phone</td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.phone)}</td></tr>` : ''}
            ${data.contact ? `<tr><td style="padding: 8px; border: 1px solid #ddd; background: #fafafa; font-weight: bold;">Contact</td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.contact)}</td></tr>` : ''}
            ${data.email ? `<tr><td style="padding: 8px; border: 1px solid #ddd; background: #fafafa; font-weight: bold;">Email</td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.email)}</td></tr>` : ''}
            ${data.offering ? `<tr><td style="padding: 8px; border: 1px solid #ddd; background: #fafafa; font-weight: bold;">Offering</td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.offering)}</td></tr>` : ''}
            ${data.date ? `<tr><td style="padding: 8px; border: 1px solid #ddd; background: #fafafa; font-weight: bold;">Preferred Date</td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.date)}</td></tr>` : ''}
            ${data.persons ? `<tr><td style="padding: 8px; border: 1px solid #ddd; background: #fafafa; font-weight: bold;">Persons</td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.persons)}</td></tr>` : ''}
            ${data.cause ? `<tr><td style="padding: 8px; border: 1px solid #ddd; background: #fafafa; font-weight: bold;">Cause</td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.cause)}</td></tr>` : ''}
            ${data.amount ? `<tr><td style="padding: 8px; border: 1px solid #ddd; background: #fafafa; font-weight: bold;">Amount (INR)</td><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; color: #1d5a2a;">₹${escapeHtml(data.amount)}</td></tr>` : ''}
            ${data.notes ? `<tr><td style="padding: 8px; border: 1px solid #ddd; background: #fafafa; font-weight: bold;">Notes</td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.notes)}</td></tr>` : ''}
            ${data.note ? `<tr><td style="padding: 8px; border: 1px solid #ddd; background: #fafafa; font-weight: bold;">Dedication / Note</td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.note)}</td></tr>` : ''}
            ${data.message ? `<tr><td style="padding: 8px; border: 1px solid #ddd; background: #fafafa; font-weight: bold;">Message</td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.message)}</td></tr>` : ''}
          </table>
          <p style="margin-top: 20px; font-size: 12px; color: #888;">This email was sent automatically from the Kodungallur Temple web portal.</p>
        </div>
      `;

      // 2A. Send Email to Admin/Owner
      if (ADMIN_EMAIL) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'Kodungallur Portal <onboarding@resend.dev>',
            to: [ADMIN_EMAIL],
            subject: subject,
            html: adminHtml
          })
        });
      }

      // 2B. Send "Received" Auto-Reply to Devotee / User (if they entered an email)
      const devoteeEmail = data.email || (data.contact && data.contact.includes('@') ? data.contact : null);
      if (devoteeEmail) {
        const userAutoReplyHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
            <div style="background: #6b1d1d; color: #fff; padding: 18px 24px; border-radius: 8px 8px 0 0;">
              <h2 style="margin: 0; color: #f5eedf; font-size: 20px;">Sree Kurumba Bhagavathy Temple</h2>
              <p style="margin: 4px 0 0; font-size: 13px; color: #e2c069;">Kodungallur, Thrissur, Kerala</p>
            </div>
            <div style="padding: 24px; border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px; background: #fff;">
              <h3 style="color: #1d5a2a; margin-top: 0;">✓ Request Received</h3>
              <p>Namaskaram <strong>${escapeHtml(data.name || 'Devotee')}</strong>,</p>
              <p>We have successfully received your <strong>${escapeHtml(type === 'pooja' ? 'pooja booking request' : type === 'donate' ? 'donation pledge' : 'message')}</strong>.</p>
              <p>Your details have been recorded in our records. Our office will review and process your request shortly.</p>
              <div style="background: #fbf7ee; padding: 12px 16px; border-left: 4px solid #b38728; margin: 16px 0;">
                <p style="margin: 0; font-size: 13px;"><strong>Reference:</strong> ${escapeHtml(data.offering || data.cause || 'General Request')}</p>
                ${data.date ? `<p style="margin: 4px 0 0; font-size: 13px;"><strong>Date:</strong> ${escapeHtml(data.date)}</p>` : ''}
              </div>
              <p style="font-size: 13px; color: #666; margin-top: 20px;">May the blessings of Kodungallur Bhagavathy be with you and your family.</p>
            </div>
          </div>
        `;

        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'Kodungallur Temple <onboarding@resend.dev>',
            to: [devoteeEmail],
            subject: 'Received: Your Request at Kodungallur Temple',
            html: userAutoReplyHtml
          })
        });
      }
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Received',
      db: dbResult
    });
  } catch (err) {
    console.error('API submit error:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
