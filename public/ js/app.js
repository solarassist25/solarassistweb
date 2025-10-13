// Google Apps Script Code - paste in Code.gs
function doPost(e) {
  try {
    // Get the data from the web form
    const data = JSON.parse(e.postData.contents);
    
    // Open your Google Sheet (replace with your actual Sheet ID)
    const sheet = SpreadsheetApp.openById('YOUR_SHEET_ID_HERE').getActiveSheet();
    
    // Create a new row with form data - matching your columns
    const timestamp = new Date();
    const row = [
      timestamp,                    // A: Timestamp
      data.name || '',             // B: Name
      data.phone || '',            // C: Phone
      data.email || '',            // D: Email
      data.message || '',          // E: Message
      'New Lead',                  // F: Status
      'solarassist.in'             // G: Source
    ];
    
    // Add the row to the sheet
    sheet.appendRow(row);
    
    // Optional: Send email notification
    try {
      MailApp.sendEmail({
        to: 'solarassist25@gmail.com',
        subject: '🌞 New SolarAssist Lead - ' + (data.name || 'Unknown'),
        htmlBody: `
          <h2>New Lead from SolarAssist Website</h2>
          <p><strong>Name:</strong> ${data.name || 'Not provided'}</p>
          <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
          <p><strong>Email:</strong> ${data.email || 'Not provided'}</p>
          <p><strong>Message:</strong> ${data.message || 'Not provided'}</p>
          <p><strong>Time:</strong> ${timestamp.toString()}</p>
          <br>
          <p><em>This lead was automatically saved to Google Sheets.</em></p>
        `
      });
    } catch (emailError) {
      console.error('Email failed:', emailError);
      // Continue even if email fails
    }
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Form submitted successfully!'
      }))
      .setMimetype(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error in doPost:', error);
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: 'Failed to save data. Please try again.'
      }))
      .setMimetype(ContentService.MimeType.JSON);
  }
}

// Test function
function testSubmit() {
  const testData = {
    name: "Test Customer",
    phone: "9876543210",
    email: "test@email.com",
    message: "Interested in solar maintenance services"
  };
  
  const result = doPost({
    postData: {
      contents: JSON.stringify(testData)
    }
  });
  
  Logger.log(result.getContent());
}
