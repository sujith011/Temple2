/**
 * Kodungallur Temple Website Configuration
 * 
 * Set your destination email address below.
 * All devotee submissions from:
 * 1. Darshan Page (Vazhipadu / Pooja booking requests)
 * 2. Donate Page (Donation pledges)
 * 3. Visit Page (General inquiries & office messages)
 * will be delivered directly to this email address.
 */
window.TEMPLE_CONFIG = {
  // Replace with your desired email address:
  adminEmail: "templeoffice@example.com",

  // Delivery service provider:
  // - 'formsubmit' (default): Free, zero-setup email forwarding.
  //   On the very first form submission to a new email address, FormSubmit sends 
  //   a 1-click confirmation link to your inbox to activate delivery.
  // - 'web3forms': Uses Web3Forms access key (from https://web3forms.com)
  provider: "formsubmit",

  // Optional: Web3Forms access key (only required if provider is 'web3forms')
  web3formsKey: ""
};
