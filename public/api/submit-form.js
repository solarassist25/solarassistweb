// api/submit-form.js
export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, phone, email, message } = req.body;

        // Your Google Apps Script Web App URL (replace with your actual URL)
        const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwE7XVJvpPiU6LaRYsUZtsdLzpWCSXoeCp1QI3pkhNz21XlvEEMawL69QlT_ApgLAt3rg/exec';

        // Send data to Google Sheets
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                phone: phone,
                email: email,
                message: message
            }),
        });

        const result = await response.json();

        if (result.success) {
            res.status(200).json({ 
                success: true, 
                message: 'Thank you! We will contact you soon for your solar service needs.' 
            });
        } else {
            res.status(500).json({ 
                success: false, 
                error: 'Failed to submit form. Please try again.' 
            });
        }
    } catch (error) {
        console.error('Form submission error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Network error. Please check your connection and try again.' 
        });
    }
}
