// popup.js - Popup UI logic

let extractedContacts = [];

// DOM elements
const extractBtn = document.getElementById('extractBtn');
const downloadBtn = document.getElementById('downloadBtn');
const downloadVcfBtn = document.getElementById('downloadVcfBtn');
const downloadButtons = document.getElementById('downloadButtons');
const statusBox = document.getElementById('statusBox');
const messageBox = document.getElementById('messageBox');
const statsDiv = document.getElementById('stats');
const totalContactsEl = document.getElementById('totalContacts');
const withPhoneEl = document.getElementById('withPhone');

// Update status display
function updateStatus(icon, text, isLoading = false) {
  if (isLoading) {
    statusBox.innerHTML = `
      <div>
        <div class="spinner"></div>
        <div class="status-text" style="margin-top: 10px;">${text}</div>
      </div>
    `;
  } else {
    statusBox.innerHTML = `
      <div>
        <div class="status-icon">${icon}</div>
        <div class="status-text">${text}</div>
      </div>
    `;
  }
}

// Show message
function showMessage(type, text) {
  const className = type === 'error' ? 'error' : type === 'warning' ? 'warning' : 'success';
  messageBox.innerHTML = `<div class="${className}">${text}</div>`;
  
  // Auto-hide success messages after 5 seconds
  if (type === 'success') {
    setTimeout(() => {
      messageBox.innerHTML = '';
    }, 5000);
  }
}

// Update statistics
function updateStats(contacts) {
  const withPhone = contacts.filter(c => c['Phone Number'] && c['Phone Number'] !== '').length;
  
  totalContactsEl.textContent = contacts.length;
  withPhoneEl.textContent = withPhone;
  
  statsDiv.classList.remove('hidden');
}

// Convert contacts array to VCF format
function convertToVCF(contacts) {
  if (contacts.length === 0) {
    return '';
  }
  
  let vcfContent = '';
  
  contacts.forEach((contact, index) => {
    // Skip groups or contacts without phone numbers
    if (contact.Group === 'Yes' || !contact['Phone Number']) {
      return;
    }
    
    const name = contact.Name || contact['Whatsapp Name'] || 'Unknown';
    const countryCode = contact['Country Code'] || '';
    const phoneNumber = contact['Phone Number'] || '';
    
    // Build full phone number in international format
    const fullPhone = countryCode ? `+${countryCode}${phoneNumber}` : phoneNumber;
    
    // Create vCard 3.0 format (most compatible)
    vcfContent += 'BEGIN:VCARD\r\n';
    vcfContent += 'VERSION:3.0\r\n';
    
    // Format name (FN = Full Name, N = Structured Name)
    vcfContent += `FN:${escapeVcfValue(name)}\r\n`;
    vcfContent += `N:${escapeVcfValue(name)};;;;\r\n`;
    
    // Add phone number in international format
    vcfContent += `TEL;TYPE=CELL:${fullPhone}\r\n`;
    
    // Add WhatsApp-specific note if WhatsApp name differs
    if (contact['Whatsapp Name'] && contact['Whatsapp Name'] !== contact.Name) {
      vcfContent += `NOTE:WhatsApp: ${escapeVcfValue(contact['Whatsapp Name'])}\r\n`;
    }
    
    // Add source
    vcfContent += 'X-WA-CONTACT:WhatsApp\r\n';
    
    vcfContent += 'END:VCARD\r\n';
    
    // Add blank line between contacts for better compatibility
    if (index < contacts.length - 1) {
      vcfContent += '\r\n';
    }
  });
  
  return vcfContent;
}

// Escape special characters in vCard values
function escapeVcfValue(value) {
  if (!value) return '';
  return String(value)
    .replace(/\\/g, '\\\\')   // Escape backslashes
    .replace(/;/g, '\\;')      // Escape semicolons
    .replace(/,/g, '\\,')      // Escape commas
    .replace(/\n/g, '\\n')     // Escape newlines
    .replace(/\r/g, '');       // Remove carriage returns
}

// Download VCF file
function downloadVCF(vcfContent, filename) {
  const blob = new Blob([vcfContent], { type: 'text/vcard;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

// Download contacts as VCF
function downloadContactsAsVCF() {
  console.log('VCF download clicked, contacts:', extractedContacts.length);
  
  if (extractedContacts.length === 0) {
    showMessage('error', '❌ No contacts to download. Extract contacts first.');
    return;
  }
  
  try {
    const vcf = convertToVCF(extractedContacts);
    
    console.log('VCF content length:', vcf.length);
    
    if (!vcf || vcf.trim() === '') {
      showMessage('error', '❌ No valid contacts with phone numbers to export to VCF.');
      return;
    }
    
    // Count valid contacts (non-groups with phone numbers)
    const validContacts = extractedContacts.filter(c => 
      c.Group !== 'Yes' && c['Phone Number']
    ).length;
    
    console.log('Valid contacts for VCF:', validContacts);
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const filename = `WhatsApp_Contacts_${timestamp}.vcf`;
    
    downloadVCF(vcf, filename);
    showMessage('success', `✅ Downloaded ${validContacts} contacts as ${filename}. You can now import this file to your phone!`);
    
  } catch (error) {
    console.error('VCF download error:', error);
    showMessage('error', '❌ Error creating VCF file: ' + error.message);
  }
}
function convertToCSV(contacts) {
  if (contacts.length === 0) {
    return '';
  }
  
  // Define headers in the exact order required
  const headers = ['Group', 'Label', 'Name', 'Whatsapp Name', 'Country Code', 'Phone Number'];
  
  // Create CSV content
  const csvRows = [];
  
  // Add header row
  csvRows.push(headers.join(','));
  
  // Add data rows
  contacts.forEach(contact => {
    const row = headers.map(header => {
      let value = contact[header];
      
      // Handle empty values
      if (value === null || value === undefined || value === '') {
        return '';
      }
      
      // Convert to string and escape quotes
      value = String(value);
      
      // If value contains comma, quote, or newline, wrap in quotes and escape internal quotes
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        value = '"' + value.replace(/"/g, '""') + '"';
      }
      
      return value;
    });
    
    csvRows.push(row.join(','));
  });
  
  return csvRows.join('\n');
}

// Download CSV file
function downloadCSV(csvContent, filename) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

// Extract contacts
async function extractContacts() {
  try {
    // Disable button and show loading
    extractBtn.disabled = true;
    updateStatus('', 'Extracting contacts...', true);
    messageBox.innerHTML = '';
    
    // Get filter options
    const onlySaved = document.getElementById('onlySaved').checked;
    const includeGroups = document.getElementById('includeGroups').checked;
    const onlyWithPhone = document.getElementById('onlyWithPhone').checked;
    
    // Get active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Check if we're on WhatsApp Web
    if (!tab.url || !tab.url.includes('web.whatsapp.com')) {
      showMessage('error', '❌ Please open WhatsApp Web first!');
      updateStatus('⚠️', 'Not on WhatsApp Web');
      extractBtn.disabled = false;
      return;
    }
    
    // Send message to content script
    chrome.tabs.sendMessage(tab.id, { 
      action: 'extractContacts',
      filters: {
        onlySaved: onlySaved,
        includeGroups: includeGroups,
        onlyWithPhone: onlyWithPhone
      }
    }, (response) => {
      if (chrome.runtime.lastError) {
        showMessage('error', '❌ Error: ' + chrome.runtime.lastError.message + '. Try refreshing WhatsApp Web.');
        updateStatus('❌', 'Extraction failed');
        extractBtn.disabled = false;
        return;
      }
      
      if (response && response.success) {
        extractedContacts = response.contacts;
        
        if (extractedContacts.length === 0) {
          showMessage('warning', '⚠️ No contacts found. Make sure WhatsApp Web is fully loaded.');
          updateStatus('⚠️', 'No contacts found');
        } else {
          updateStatus('✅', `Successfully extracted ${extractedContacts.length} contacts!`);
          updateStats(extractedContacts);
          
          // Show warning if using DOM method
          if (response.method === 'dom') {
            showMessage('warning', '⚠️ Phone numbers may not be available. This is a limitation of WhatsApp Web\'s DOM structure.');
          } else {
            showMessage('success', `✅ Successfully extracted ${extractedContacts.length} contacts with phone numbers!`);
          }
          
          // Enable download button
          downloadButtons.classList.remove('hidden');
        }
      } else {
        showMessage('error', '❌ Failed to extract contacts: ' + (response?.error || 'Unknown error'));
        updateStatus('❌', 'Extraction failed');
      }
      
      extractBtn.disabled = false;
    });
    
  } catch (error) {
    showMessage('error', '❌ Error: ' + error.message);
    updateStatus('❌', 'Extraction failed');
    extractBtn.disabled = false;
  }
}

// Download contacts
function downloadContacts() {
  if (extractedContacts.length === 0) {
    showMessage('error', '❌ No contacts to download. Extract contacts first.');
    return;
  }
  
  try {
    const csv = convertToCSV(extractedContacts);
    
    if (!csv) {
      showMessage('error', '❌ Failed to generate CSV file.');
      return;
    }
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const filename = `WhatsApp_Contacts_${timestamp}.csv`;
    
    downloadCSV(csv, filename);
    showMessage('success', `✅ Downloaded ${extractedContacts.length} contacts as ${filename}`);
    
  } catch (error) {
    showMessage('error', '❌ Error downloading file: ' + error.message);
  }
}

// Event listeners
extractBtn.addEventListener('click', extractContacts);
downloadBtn.addEventListener('click', downloadContacts);
downloadVcfBtn.addEventListener('click', downloadContactsAsVCF);

// Check if WhatsApp Web is ready on popup open
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (tabs[0] && tabs[0].url && tabs[0].url.includes('web.whatsapp.com')) {
    updateStatus('✅', 'WhatsApp Web detected. Ready to extract!');
  } else {
    updateStatus('⚠️', 'Please navigate to WhatsApp Web');
    showMessage('warning', '⚠️ Open https://web.whatsapp.com to use this extension.');
  }
});