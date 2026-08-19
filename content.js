// content.js - Main extraction logic

// Helper function to parse phone number and extract country code
function parsePhoneNumber(phoneStr) {
  if (!phoneStr) return { countryCode: '', phoneNumber: '', fullNumber: '' };
  
  // Remove any non-digit characters
  const digits = phoneStr.replace(/\D/g, '');
  
  // If no digits, return empty
  if (!digits) return { countryCode: '', phoneNumber: '', fullNumber: digits };
  
  // Store the full number for reference
  const fullNumber = digits;
  
  // Common country code patterns and their lengths
  const countryCodePatterns = [
    { code: '1', length: 1, totalLength: 11 },      // US/Canada
    { code: '7', length: 1, totalLength: 11 },      // Russia/Kazakhstan
    { code: '20', length: 2, totalLength: 11 },     // Egypt
    { code: '27', length: 2, totalLength: 11 },     // South Africa
    { code: '30', length: 2, totalLength: 12 },     // Greece
    { code: '31', length: 2, totalLength: 11 },     // Netherlands
    { code: '32', length: 2, totalLength: 11 },     // Belgium
    { code: '33', length: 2, totalLength: 11 },     // France
    { code: '34', length: 2, totalLength: 11 },     // Spain
    { code: '36', length: 2, totalLength: 11 },     // Hungary
    { code: '39', length: 2, totalLength: 12 },     // Italy
    { code: '40', length: 2, totalLength: 11 },     // Romania
    { code: '41', length: 2, totalLength: 11 },     // Switzerland
    { code: '43', length: 2, totalLength: 12 },     // Austria
    { code: '44', length: 2, totalLength: 12 },     // UK
    { code: '45', length: 2, totalLength: 10 },     // Denmark
    { code: '46', length: 2, totalLength: 11 },     // Sweden
    { code: '47', length: 2, totalLength: 10 },     // Norway
    { code: '48', length: 2, totalLength: 11 },     // Poland
    { code: '49', length: 2, totalLength: 12 },     // Germany
    { code: '51', length: 2, totalLength: 11 },     // Peru
    { code: '52', length: 2, totalLength: 12 },     // Mexico
    { code: '53', length: 2, totalLength: 10 },     // Cuba
    { code: '54', length: 2, totalLength: 12 },     // Argentina
    { code: '55', length: 2, totalLength: 13 },     // Brazil
    { code: '56', length: 2, totalLength: 11 },     // Chile
    { code: '57', length: 2, totalLength: 12 },     // Colombia
    { code: '58', length: 2, totalLength: 12 },     // Venezuela
    { code: '60', length: 2, totalLength: 11 },     // Malaysia
    { code: '61', length: 2, totalLength: 11 },     // Australia
    { code: '62', length: 2, totalLength: 11 },     // Indonesia
    { code: '63', length: 2, totalLength: 12 },     // Philippines
    { code: '64', length: 2, totalLength: 11 },     // New Zealand
    { code: '65', length: 2, totalLength: 10 },     // Singapore
    { code: '66', length: 2, totalLength: 11 },     // Thailand
    { code: '81', length: 2, totalLength: 12 },     // Japan
    { code: '82', length: 2, totalLength: 11 },     // South Korea
    { code: '84', length: 2, totalLength: 11 },     // Vietnam
    { code: '86', length: 2, totalLength: 13 },     // China
    { code: '90', length: 2, totalLength: 12 },     // Turkey
    { code: '91', length: 2, totalLength: 12 },     // India
    { code: '92', length: 2, totalLength: 12 },     // Pakistan
    { code: '93', length: 2, totalLength: 11 },     // Afghanistan
    { code: '94', length: 2, totalLength: 11 },     // Sri Lanka
    { code: '95', length: 2, totalLength: 10 },     // Myanmar
    { code: '98', length: 2, totalLength: 12 },     // Iran
    { code: '212', length: 3, totalLength: 12 },    // Morocco
    { code: '213', length: 3, totalLength: 12 },    // Algeria
    { code: '216', length: 3, totalLength: 11 },    // Tunisia
    { code: '218', length: 3, totalLength: 11 },    // Libya
    { code: '220', length: 3, totalLength: 10 },    // Gambia
    { code: '221', length: 3, totalLength: 12 },    // Senegal
    { code: '222', length: 3, totalLength: 11 },    // Mauritania
    { code: '223', length: 3, totalLength: 11 },    // Mali
    { code: '224', length: 3, totalLength: 12 },    // Guinea
    { code: '225', length: 3, totalLength: 12 },    // Ivory Coast
    { code: '226', length: 3, totalLength: 11 },    // Burkina Faso
    { code: '227', length: 3, totalLength: 11 },    // Niger
    { code: '228', length: 3, totalLength: 11 },    // Togo
    { code: '229', length: 3, totalLength: 11 },    // Benin
    { code: '230', length: 3, totalLength: 11 },    // Mauritius
    { code: '231', length: 3, totalLength: 11 },    // Liberia
    { code: '232', length: 3, totalLength: 11 },    // Sierra Leone
    { code: '233', length: 3, totalLength: 12 },    // Ghana
    { code: '234', length: 3, totalLength: 13 },    // Nigeria
    { code: '235', length: 3, totalLength: 11 },    // Chad
    { code: '236', length: 3, totalLength: 11 },    // Central African Republic
    { code: '237', length: 3, totalLength: 12 },    // Cameroon
    { code: '238', length: 3, totalLength: 10 },    // Cape Verde
    { code: '239', length: 3, totalLength: 10 },    // São Tomé and Príncipe
    { code: '240', length: 3, totalLength: 12 },    // Equatorial Guinea
    { code: '241', length: 3, totalLength: 11 },    // Gabon
    { code: '242', length: 3, totalLength: 12 },    // Republic of the Congo
    { code: '243', length: 3, totalLength: 12 },    // Democratic Republic of the Congo
    { code: '244', length: 3, totalLength: 12 },    // Angola
    { code: '245', length: 3, totalLength: 10 },    // Guinea-Bissau
    { code: '246', length: 3, totalLength: 10 },    // British Indian Ocean Territory
    { code: '248', length: 3, totalLength: 10 },    // Seychelles
    { code: '249', length: 3, totalLength: 12 },    // Sudan
    { code: '250', length: 3, totalLength: 12 },    // Rwanda
    { code: '251', length: 3, totalLength: 12 },    // Ethiopia
    { code: '252', length: 3, totalLength: 11 },    // Somalia
    { code: '253', length: 3, totalLength: 11 },    // Djibouti
    { code: '254', length: 3, totalLength: 12 },    // Kenya
    { code: '255', length: 3, totalLength: 12 },    // Tanzania
    { code: '256', length: 3, totalLength: 12 },    // Uganda
    { code: '257', length: 3, totalLength: 11 },    // Burundi
    { code: '258', length: 3, totalLength: 12 },    // Mozambique
    { code: '260', length: 3, totalLength: 12 },    // Zambia
    { code: '261', length: 3, totalLength: 12 },    // Madagascar
    { code: '262', length: 3, totalLength: 12 },    // Réunion
    { code: '263', length: 3, totalLength: 12 },    // Zimbabwe
    { code: '264', length: 3, totalLength: 12 },    // Namibia
    { code: '265', length: 3, totalLength: 12 },    // Malawi
    { code: '266', length: 3, totalLength: 11 },    // Lesotho
    { code: '267', length: 3, totalLength: 11 },    // Botswana
    { code: '268', length: 3, totalLength: 11 },    // Eswatini
    { code: '269', length: 3, totalLength: 10 },    // Comoros
    { code: '290', length: 3, totalLength: 8 },     // Saint Helena
    { code: '291', length: 3, totalLength: 10 },    // Eritrea
    { code: '297', length: 3, totalLength: 10 },    // Aruba
    { code: '298', length: 3, totalLength: 9 },     // Faroe Islands
    { code: '299', length: 3, totalLength: 9 },     // Greenland
    { code: '350', length: 3, totalLength: 11 },    // Gibraltar
    { code: '351', length: 3, totalLength: 12 },    // Portugal
    { code: '352', length: 3, totalLength: 12 },    // Luxembourg
    { code: '353', length: 3, totalLength: 12 },    // Ireland
    { code: '354', length: 3, totalLength: 10 },    // Iceland
    { code: '355', length: 3, totalLength: 12 },    // Albania
    { code: '356', length: 3, totalLength: 11 },    // Malta
    { code: '357', length: 3, totalLength: 11 },    // Cyprus
    { code: '358', length: 3, totalLength: 12 },    // Finland
    { code: '359', length: 3, totalLength: 12 },    // Bulgaria
    { code: '370', length: 3, totalLength: 11 },    // Lithuania
    { code: '371', length: 3, totalLength: 11 },    // Latvia
    { code: '372', length: 3, totalLength: 11 },    // Estonia
    { code: '373', length: 3, totalLength: 11 },    // Moldova
    { code: '374', length: 3, totalLength: 11 },    // Armenia
    { code: '375', length: 3, totalLength: 12 },    // Belarus
    { code: '376', length: 3, totalLength: 9 },     // Andorra
    { code: '377', length: 3, totalLength: 11 },    // Monaco
    { code: '378', length: 3, totalLength: 12 },    // San Marino
    { code: '380', length: 3, totalLength: 12 },    // Ukraine
    { code: '381', length: 3, totalLength: 12 },    // Serbia
    { code: '382', length: 3, totalLength: 11 },    // Montenegro
    { code: '383', length: 3, totalLength: 11 },    // Kosovo
    { code: '385', length: 3, totalLength: 12 },    // Croatia
    { code: '386', length: 3, totalLength: 11 },    // Slovenia
    { code: '387', length: 3, totalLength: 11 },    // Bosnia and Herzegovina
    { code: '389', length: 3, totalLength: 11 },    // North Macedonia
    { code: '420', length: 3, totalLength: 12 },    // Czech Republic
    { code: '421', length: 3, totalLength: 12 },    // Slovakia
    { code: '423', length: 3, totalLength: 10 },    // Liechtenstein
    { code: '500', length: 3, totalLength: 8 },     // Falkland Islands
    { code: '501', length: 3, totalLength: 10 },    // Belize
    { code: '502', length: 3, totalLength: 11 },    // Guatemala
    { code: '503', length: 3, totalLength: 11 },    // El Salvador
    { code: '504', length: 3, totalLength: 11 },    // Honduras
    { code: '505', length: 3, totalLength: 11 },    // Nicaragua
    { code: '506', length: 3, totalLength: 11 },    // Costa Rica
    { code: '507', length: 3, totalLength: 11 },    // Panama
    { code: '508', length: 3, totalLength: 9 },     // Saint Pierre and Miquelon
    { code: '509', length: 3, totalLength: 11 },    // Haiti
    { code: '590', length: 3, totalLength: 12 },    // Guadeloupe
    { code: '591', length: 3, totalLength: 11 },    // Bolivia
    { code: '592', length: 3, totalLength: 10 },    // Guyana
    { code: '593', length: 3, totalLength: 12 },    // Ecuador
    { code: '594', length: 3, totalLength: 12 },    // French Guiana
    { code: '595', length: 3, totalLength: 12 },    // Paraguay
    { code: '596', length: 3, totalLength: 12 },    // Martinique
    { code: '597', length: 3, totalLength: 10 },    // Suriname
    { code: '598', length: 3, totalLength: 11 },    // Uruguay
    { code: '599', length: 3, totalLength: 10 },    // Curaçao
    { code: '670', length: 3, totalLength: 11 },    // East Timor
    { code: '672', length: 3, totalLength: 9 },     // Australian External Territories
    { code: '673', length: 3, totalLength: 10 },    // Brunei
    { code: '674', length: 3, totalLength: 10 },    // Nauru
    { code: '675', length: 3, totalLength: 11 },    // Papua New Guinea
    { code: '676', length: 3, totalLength: 8 },     // Tonga
    { code: '677', length: 3, totalLength: 10 },    // Solomon Islands
    { code: '678', length: 3, totalLength: 10 },    // Vanuatu
    { code: '679', length: 3, totalLength: 10 },    // Fiji
    { code: '680', length: 3, totalLength: 10 },    // Palau
    { code: '681', length: 3, totalLength: 9 },     // Wallis and Futuna
    { code: '682', length: 3, totalLength: 8 },     // Cook Islands
    { code: '683', length: 3, totalLength: 7 },     // Niue
    { code: '685', length: 3, totalLength: 10 },    // Samoa
    { code: '686', length: 3, totalLength: 8 },     // Kiribati
    { code: '687', length: 3, totalLength: 9 },     // New Caledonia
    { code: '688', length: 3, totalLength: 9 },     // Tuvalu
    { code: '689', length: 3, totalLength: 11 },    // French Polynesia
    { code: '690', length: 3, totalLength: 7 },     // Tokelau
    { code: '691', length: 3, totalLength: 10 },    // Micronesia
    { code: '692', length: 3, totalLength: 10 },    // Marshall Islands
    { code: '850', length: 3, totalLength: 12 },    // North Korea
    { code: '852', length: 3, totalLength: 11 },    // Hong Kong
    { code: '853', length: 3, totalLength: 11 },    // Macau
    { code: '855', length: 3, totalLength: 11 },    // Cambodia
    { code: '856', length: 3, totalLength: 11 },    // Laos
    { code: '880', length: 3, totalLength: 13 },    // Bangladesh
    { code: '886', length: 3, totalLength: 12 },    // Taiwan
    { code: '960', length: 3, totalLength: 10 },    // Maldives
    { code: '961', length: 3, totalLength: 11 },    // Lebanon
    { code: '962', length: 3, totalLength: 12 },    // Jordan
    { code: '963', length: 3, totalLength: 12 },    // Syria
    { code: '964', length: 3, totalLength: 12 },    // Iraq
    { code: '965', length: 3, totalLength: 11 },    // Kuwait
    { code: '966', length: 3, totalLength: 12 },    // Saudi Arabia
    { code: '967', length: 3, totalLength: 12 },    // Yemen
    { code: '968', length: 3, totalLength: 11 },    // Oman
    { code: '970', length: 3, totalLength: 12 },    // Palestine
    { code: '971', length: 3, totalLength: 12 },    // United Arab Emirates
    { code: '972', length: 3, totalLength: 12 },    // Israel
    { code: '973', length: 3, totalLength: 11 },    // Bahrain
    { code: '974', length: 3, totalLength: 11 },    // Qatar
    { code: '975', length: 3, totalLength: 11 },    // Bhutan
    { code: '976', length: 3, totalLength: 11 },    // Mongolia
    { code: '977', length: 3, totalLength: 12 },    // Nepal
    { code: '992', length: 3, totalLength: 12 },    // Tajikistan
    { code: '993', length: 3, totalLength: 11 },    // Turkmenistan
    { code: '994', length: 3, totalLength: 12 },    // Azerbaijan
    { code: '995', length: 3, totalLength: 12 },    // Georgia
    { code: '996', length: 3, totalLength: 12 },    // Kyrgyzstan
    { code: '998', length: 3, totalLength: 12 },    // Uzbekistan
  ];
  
  // Try to match against known country codes
  for (const pattern of countryCodePatterns) {
    if (digits.startsWith(pattern.code)) {
      const countryCode = pattern.code;
      const phoneNumber = digits.substring(pattern.code.length);
      return { countryCode, phoneNumber, fullNumber };
    }
  }
  
  // If no pattern matched and number is very long, try generic parsing
  if (digits.length >= 10) {
    // Try 1-3 digit country codes based on total length
    if (digits.length === 11) {
      // Could be 1 digit country code
      return { 
        countryCode: digits.substring(0, 1), 
        phoneNumber: digits.substring(1),
        fullNumber 
      };
    } else if (digits.length === 12) {
      // Could be 2 digit country code
      return { 
        countryCode: digits.substring(0, 2), 
        phoneNumber: digits.substring(2),
        fullNumber 
      };
    } else if (digits.length === 13) {
      // Could be 3 digit country code
      return { 
        countryCode: digits.substring(0, 3), 
        phoneNumber: digits.substring(3),
        fullNumber 
      };
    }
  }
  
  // If all else fails, return the whole number as phone number with no country code
  return { countryCode: '', phoneNumber: digits, fullNumber };
}

// Extract contacts from WhatsApp Web's IndexedDB
async function extractContactsFromIndexedDB(filters = {}) {
  const { includeGroups = false, onlyWithPhone = true, onlySaved = true } = filters;
  
  return new Promise((resolve, reject) => {
    const dbRequest = indexedDB.open('model-storage');
    
    dbRequest.onerror = () => {
      console.error('Failed to open IndexedDB');
      reject(new Error('Could not access WhatsApp database'));
    };
    
    dbRequest.onsuccess = (event) => {
      const db = event.target.result;
      
      // Check if contact store exists
      if (!db.objectStoreNames.contains('contact')) {
        console.error('Contact store not found');
        reject(new Error('Contact store not found in database'));
        return;
      }
      
      const transaction = db.transaction(['contact'], 'readonly');
      const objectStore = transaction.objectStore('contact');
      const getAllRequest = objectStore.getAll();
      
      getAllRequest.onsuccess = () => {
        const contacts = getAllRequest.result;
        const processedContacts = [];
        
        console.log('Total contacts in database:', contacts.length);
        
        // Debug: Log the structure of first contact to understand format
        if (contacts.length > 0) {
          console.log('First contact structure:', JSON.stringify(contacts[0], null, 2));
          console.log('First contact keys:', Object.keys(contacts[0]));
        }
        
        contacts.forEach((contact, index) => {
          try {
            // Skip if no valid ID
            if (!contact.id) return;
            
            // Extract the actual phone number properly
            let phoneWithCountryCode = '';
            let server = '';
            let isLid = false;
            
            // Check the structure of contact.id
            if (typeof contact.id === 'object' && contact.id !== null) {
              // New format: contact.id is an object with 'user' and 'server' properties
              phoneWithCountryCode = contact.id.user || '';
              server = contact.id.server || '';
              
              // Check if it's a lid (Local ID) - these are NOT phone numbers
              if (contact.id._serialized && contact.id._serialized.includes('@lid')) {
                isLid = true;
              }
            } else if (typeof contact.id === 'string') {
              // Old format: contact.id is a string like "923001234567@c.us"
              const parts = contact.id.split('@');
              phoneWithCountryCode = parts[0] || '';
              server = parts[1] || '';
              
              // Check if it's a lid
              if (contact.id.includes('@lid')) {
                isLid = true;
              }
            }
            
            // If it's a lid, try to get the actual phone number from other fields
            if (isLid) {
              // Try to find the actual phone number in other contact properties
              phoneWithCountryCode = contact.userid || contact.number || '';
              
              // If still no phone, skip this contact (lids don't have real phone numbers)
              if (!phoneWithCountryCode) {
                // Debug first few lids
                if (index < 3) {
                  console.log('Skipping LID (no phone):', contact.id, contact);
                }
                return;
              }
            }
            
            // Determine if it's a group
            const isGroup = server === 'g.us' || contact.isGroup === true;
            
            // FILTERING LOGIC - Skip unwanted entries
            
            // Skip groups if not requested
            if (isGroup && !includeGroups) return;
            
            // Skip entries without phone numbers
            if (!phoneWithCountryCode) return;
            
            // Skip WhatsApp status/system entries
            if (phoneWithCountryCode === 'status' || phoneWithCountryCode === 'broadcast') return;
            
            // Skip very short or invalid phone numbers (less than 4 digits)
            const digitsOnly = phoneWithCountryCode.replace(/\D/g, '');
            if (digitsOnly.length < 4) return;
            
            // Skip if phone number is too long (likely corrupted data)
            if (digitsOnly.length > 15) return;
            
            // Get contact name (prefer saved name over push name)
            const name = contact.name || contact.pushname || contact.verifiedName || '';
            const whatsappName = contact.pushname || '';
            
            // CRITICAL: Only extract SAVED contacts
            const isSavedContact = contact.isMyContact === true || (contact.name && contact.name.trim() !== '');
            
            // Skip if not a saved contact (unless it's a group and groups are included)
            if (onlySaved && !isSavedContact && !isGroup) return;
            
            // Skip entries without any name (likely system/deleted contacts)
            if (!name && !whatsappName && !isGroup) return;
            
            // Skip if marked as deleted or not a contact
            if (contact.isDeleted === true) return;
            
            // Parse phone number to separate country code
            const { countryCode, phoneNumber, fullNumber } = parsePhoneNumber(phoneWithCountryCode);
            
            // Debug logging for first few valid contacts
            if (processedContacts.length < 5) {
              console.log('Sample contact extraction:', {
                rawId: contact.id,
                isLid,
                phoneWithCountryCode,
                fullNumber,
                parsedCountryCode: countryCode,
                parsedPhoneNumber: phoneNumber,
                name,
                whatsappName,
                isGroup,
                isSavedContact,
                isMyContact: contact.isMyContact
              });
            }
            
            // Skip if parsing failed completely and onlyWithPhone is true
            if (onlyWithPhone && !countryCode && !phoneNumber && !isGroup) return;
            
            // Skip contacts without valid phone numbers if filter is enabled
            if (onlyWithPhone && !phoneNumber && !isGroup) return;
            
            processedContacts.push({
              Group: isGroup ? 'Yes' : '',
              Label: '', // WhatsApp Web doesn't expose labels, leave empty
              Name: name,
              'Whatsapp Name': whatsappName,
              'Country Code': countryCode ? parseInt(countryCode) : '',
              'Phone Number': phoneNumber ? parseInt(phoneNumber) : ''
            });
          } catch (err) {
            console.error('Error processing contact:', err);
          }
        });
        
        console.log('Processed contacts count:', processedContacts.length);
        resolve(processedContacts);
      };
      
      getAllRequest.onerror = () => {
        reject(new Error('Failed to retrieve contacts from database'));
      };
    };
  });
}

// Fallback: Extract contacts from DOM
function extractContactsFromDOM() {
  const contacts = [];
  
  // Find all chat elements
  const chatElements = document.querySelectorAll('[data-testid="cell-frame-container"]');
  
  chatElements.forEach((element, index) => {
    try {
      // Extract name from title attribute
      const nameElement = element.querySelector('span[dir="auto"][title]');
      const name = nameElement ? nameElement.getAttribute('title') : '';
      
      if (!name) return;
      
      // Check if it's a group (groups usually have different indicators)
      const isGroup = element.querySelector('[data-testid="default-group"]') !== null;
      
      contacts.push({
        Group: isGroup ? 'Yes' : '',
        Label: '',
        Name: name,
        'Whatsapp Name': name, // DOM doesn't distinguish, so use same
        'Country Code': '', // Not available from DOM
        'Phone Number': '' // Not available from DOM
      });
    } catch (err) {
      console.error('Error extracting contact from DOM:', err);
    }
  });
  
  return contacts;
}

// Main extraction function
async function extractAllContacts(filters = {}) {
  try {
    // Try IndexedDB first (most reliable)
    const contacts = await extractContactsFromIndexedDB(filters);
    
    // Filter out empty contacts
    const validContacts = contacts.filter(c => 
      c.Name || c['Whatsapp Name'] || c['Phone Number']
    );
    
    return {
      success: true,
      contacts: validContacts,
      method: 'indexeddb',
      count: validContacts.length
    };
  } catch (err) {
    console.warn('IndexedDB extraction failed, falling back to DOM:', err);
    
    // Fallback to DOM extraction
    const contacts = extractContactsFromDOM();
    
    return {
      success: true,
      contacts: contacts,
      method: 'dom',
      count: contacts.length,
      warning: 'Phone numbers not available via DOM extraction. Please ensure WhatsApp Web is fully loaded.'
    };
  }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractContacts') {
    const filters = request.filters || {};
    
    extractAllContacts(filters)
      .then(result => {
        sendResponse(result);
      })
      .catch(error => {
        sendResponse({
          success: false,
          error: error.message
        });
      });
    
    return true; // Will respond asynchronously
  }
  
  if (request.action === 'checkWhatsAppReady') {
    // Check if WhatsApp Web is loaded
    const isReady = document.querySelector('[data-testid="chat-list"]') !== null;
    sendResponse({ ready: isReady });
  }
});

// Notify popup when page is ready
window.addEventListener('load', () => {
  setTimeout(() => {
    chrome.runtime.sendMessage({ action: 'pageReady' });
  }, 2000);
});