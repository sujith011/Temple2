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

  if (!type || !data || typeof data !== 'object' || Array.isArray(data)) {
    return res.status(400).json({ error: 'Missing submission payload' });
  }

  if (!['pooja', 'donate', 'inquiry'].includes(type)) {
    return res.status(400).json({ error: 'Unsupported form type' });
  }

  if (type === 'pooja') {
    const validationError = validatePooja(data);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }
  }

  if (type === 'donate') {
    const validationError = validateDonation(data);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }
  }

  if (type === 'inquiry') {
    const validationError = validateInquiry(data);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }
  }

  let rawUrl = (process.env.SUPABASE_URL || '').trim().replace(/\/+$/, '');
  const matchDashboard = rawUrl.match(/supabase\.com\/dashboard\/project\/([a-zA-Z0-9_-]+)/i);
  if (matchDashboard) {
    rawUrl = `https://${matchDashboard[1]}.supabase.co`;
  }
  const SUPABASE_URL = rawUrl.replace(/\/rest\/v1\/?$/i, '');
  const SUPABASE_SECRET_KEY = (
    process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  ).trim();
  const RESEND_API_KEY = (process.env.RESEND_API_KEY || '').trim();
  const RESEND_FROM_EMAIL = (process.env.RESEND_FROM_EMAIL || '').trim();
  const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || process.env.OWNER_EMAIL || '').trim();

  let dbResult = { status: 'skipped' };
  let emailResult = { status: 'skipped' };

  try {
    // -------------------------------------------------------------
    // 1. SAVE INTO SUPABASE DATABASE
    // -------------------------------------------------------------
    if (SUPABASE_URL && SUPABASE_SECRET_KEY) {
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
          email: data.email || '',
          phone: data.phone || null,
          message: data.message || '',
          status: 'pending'
        };
      }

      const endpoint = `${SUPABASE_URL}/rest/v1/${tableName}`;
      const dbHeaders = {
        'apikey': SUPABASE_SECRET_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Prefer': 'return=minimal'
      };

      // Legacy service-role keys are JWTs and also require Authorization.
      // New sb_secret_ keys must be sent through the apikey header only.
      if (!SUPABASE_SECRET_KEY.startsWith('sb_secret_')) {
        dbHeaders.Authorization = `Bearer ${SUPABASE_SECRET_KEY}`;
      }

      const dbResponse = await fetch(endpoint, {
        method: 'POST',
        headers: dbHeaders,
        body: JSON.stringify(dbRecord)
      });

      if (!dbResponse.ok) {
        const errorText = await dbResponse.text();
        console.error('Supabase insert failed:', dbResponse.status, errorText);
        throw new Error('Database insert failed');
      } else {
        dbResult = { status: 'success' };
      }
    }

    // -------------------------------------------------------------
    // 2. DISPATCH EMAILS VIA RESEND
    // -------------------------------------------------------------
    if (RESEND_API_KEY && RESEND_FROM_EMAIL && ADMIN_EMAIL) {
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
      try {
        await sendResendEmail(RESEND_API_KEY, {
          from: RESEND_FROM_EMAIL,
          to: [ADMIN_EMAIL],
          subject: subject,
          html: adminHtml
        });

        // 2B. Send "Received" Auto-Reply to Devotee / User (if they entered an email)
        const devoteeEmail = data.email || null;
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

          await sendResendEmail(RESEND_API_KEY, {
            from: RESEND_FROM_EMAIL,
            to: [devoteeEmail],
            subject: 'Received: Your Request at Kodungallur Temple',
            html: userAutoReplyHtml
          });
        }

        emailResult = { status: 'success' };
      } catch (emailError) {
        console.error('Resend delivery failed:', emailError.message);
        emailResult = { status: 'error' };
      }
    }

    if (dbResult.status !== 'success' && emailResult.status !== 'success') {
      return res.status(503).json({ error: 'Form delivery is not configured' });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Received',
      storage: dbResult.status,
      email: emailResult.status
    });
  } catch (err) {
    console.error('API submit error:', err);
    return res.status(500).json({ error: 'Unable to process the request' });
  }
}

async function sendResendEmail(apiKey, payload) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Resend API error:', response.status, errorText);
    throw new Error('Email delivery failed');
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

function validateDonation(data) {
  const name = typeof data.name === 'string' ? data.name.trim() : '';
  const phone = typeof data.phone === 'string' ? data.phone.trim() : '';
  const email = typeof data.email === 'string' ? data.email.trim() : '';
  const amount = Number(data.amount);

  if (!name || name.length > 150 || /\p{N}/u.test(name) || !/\p{L}/u.test(name)) {
    return 'Name must contain letters and cannot contain numbers';
  }

  if (!/^\d{1,20}$/.test(phone)) {
    return 'Phone is required and must contain numbers only';
  }

  if (email && (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
    return 'Email address is invalid';
  }

  if (!['annadanam', 'charity', 'renovation'].includes(data.cause)) {
    return 'Donation cause is invalid';
  }

  if (!Number.isInteger(amount) || amount < 100) {
    return 'Amount must be a whole number of at least 100 INR';
  }

  if (typeof data.note === 'string' && data.note.length > 2000) {
    return 'Note is too long';
  }

  return '';
}

function validatePooja(data) {
  const name = typeof data.name === 'string' ? data.name.trim() : '';
  const star = typeof data.star === 'string' ? data.star.trim() : '';
  const phone = typeof data.phone === 'string' ? data.phone.trim() : '';
  const email = typeof data.email === 'string' ? data.email.trim() : '';
  const offering = typeof data.offering === 'string' ? data.offering.trim() : '';
  const date = typeof data.date === 'string' ? data.date.trim() : '';
  const persons = Number(data.persons);

  if (!name || name.length > 150 || /\p{N}/u.test(name) || !/\p{L}/u.test(name)) {
    return 'Name must contain letters and cannot contain numbers';
  }

  if (!star || star.length > 100 || !/^[\p{L}\p{M}\s]+$/u.test(star) || !/\p{L}/u.test(star)) {
    return 'Star must contain letters only';
  }

  if (!/^\d{1,20}$/.test(phone)) {
    return 'Phone is required and must contain numbers only';
  }

  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'A valid email address is required';
  }

  if (!['nakshatra', 'guruthy', 'archana', 'rektha', 'other'].includes(offering)) {
    return 'Offering is invalid';
  }

  const today = getDateInTimeZone('Asia/Kolkata');
  const maximumDate = addCalendarMonths(today, 3);
  if (!isValidDateString(date) || date < today || date > maximumDate) {
    return `Preferred date must be between ${today} and ${maximumDate}`;
  }

  if (!Number.isInteger(persons) || persons < 1) {
    return 'Number of persons must be a whole number of at least 1';
  }

  if (typeof data.notes === 'string' && data.notes.length > 2000) {
    return 'Notes are too long';
  }

  return '';
}

function validateInquiry(data) {
  const name = typeof data.name === 'string' ? data.name.trim() : '';
  const email = typeof data.email === 'string' ? data.email.trim() : '';
  const phone = typeof data.phone === 'string' ? data.phone.trim() : '';
  const message = typeof data.message === 'string' ? data.message.trim() : '';

  if (!name || name.length > 150 || /\p{N}/u.test(name) || !/\p{L}/u.test(name)) {
    return 'Name must contain letters and cannot contain numbers';
  }

  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'A valid email address is required';
  }

  if (phone && !/^\d{1,20}$/.test(phone)) {
    return 'Phone must contain numbers only';
  }

  if (!message || message.length > 5000) {
    return 'Message is required';
  }

  return '';
}

function getDateInTimeZone(timeZone) {
  const parts = new Intl.DateTimeFormat('en', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function addCalendarMonths(dateString, monthsToAdd) {
  const [year, month, day] = dateString.split('-').map(Number);
  const target = new Date(Date.UTC(year, month - 1 + monthsToAdd, 1));
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  const targetDay = Math.min(day, lastDay);
  const targetMonth = String(target.getUTCMonth() + 1).padStart(2, '0');
  return `${target.getUTCFullYear()}-${targetMonth}-${String(targetDay).padStart(2, '0')}`;
}

function isValidDateString(dateString) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return false;
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.toISOString().slice(0, 10) === dateString;
}
