// Require the dotenv package to load the .env file
require('dotenv').config();

// Now you can use the SendGrid API key securely from the environment variables
const sendGridApiKey = process.env.SENDGRID_API_KEY;

// Example: Log the API key to the console (for debugging purposes)
console.log(sendGridApiKey);

// Your original code for the custom element
(function () {
    let template = document.createElement("template");
    template.innerHTML = `
      <style>
        :host {
            display: inline-block;
            background-color: #0078d4;
            border-radius: 50px;
            color: #FFF;
            cursor: pointer;
            font-weight: bold;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            text-transform: uppercase;
        }
        #caption {
            position: relative;
            margin-top: 0px;
        }
      </style>
      <div>
          <img src="https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg" width="30"/>
          <span id="caption"></span>
      </div>
    `;
    
    class outlookwidgetWidget extends HTMLElement {
        constructor() {
            super();
            let shadowRoot = this.attachShadow({mode: "open"});
            shadowRoot.appendChild(template.content.cloneNode(true));
            this._props = {};
            this.addEventListener("click", this.onClick.bind(this));
        }
        
        async connectedCallback() {
            this.initMain();
        }
        
        async initMain() {
            let caption = this._props.caption;
            this.shadowRoot.querySelector("#caption").textContent = caption;
        }
  
        onCustomWidgetBeforeUpdate(changedProperties) {
            this._props = { ...this._props, ...changedProperties };
        }
  
        onCustomWidgetAfterUpdate(changedProperties) {
            this.initMain();
        }
  
        async onClick() {
            // Fetch story content including widgets
            let storyContent = await this.getStoryContent();
  
            // Call SendGrid API to send the email with the page content as a PDF
            await this.sendEmailWithPdf(storyContent);
        }
  
        async getStoryContent() {
            // Get the entire HTML content of the page (can be refined based on your needs)
            return document.body.innerHTML; // Or a more specific selector if needed
        }
  
        async sendEmailWithPdf(storyContent) {
            // Use the SendGrid API Key from the environment variables
            const sendGridApiKey = process.env.SENDGRID_API_KEY;
            
            const emailData = {
                personalizations: [{
                    to: [{ email: this._props.email }],
                    subject: this._props.subject
                }],
                from: { email: 'your-email@example.com' }, // Replace with your email address
                content: [{
                    type: 'text/html',
                    value: `<h1>${this._props.subject}</h1><p>${this._props.Body}</p><div>${storyContent}</div>`
                }],
                attachments: [{
                    content: await this.convertToPdf(storyContent),
                    filename: 'page-content.pdf',
                    type: 'application/pdf',
                    disposition: 'attachment'
                }]
            };
  
            const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${sendGridApiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(emailData)
            });
  
            if (response.ok) {
                console.log("Email sent successfully");
            } else {
                console.error("Failed to send email:", await response.text());
            }
        }
  
        async convertToPdf(content) {
            const apiKey = 'sk_89d41184a7c3982908d64682afe9f78ec1e15f6a';  // Replace with your actual PDFShift API key
            
            const response = await fetch('https://api.pdfshift.io/v3/convert', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`  // Add Bearer token for PDFShift authentication
                },
                body: JSON.stringify({
                    source: content  // Send the HTML content to be converted into PDF
                })
            });
            
            if (response.ok) {
                const pdfBlob = await response.blob(); // Get the PDF as a Blob
                const reader = new FileReader();
                reader.readAsDataURL(pdfBlob); // Convert the Blob into a base64-encoded string
  
                return new Promise((resolve, reject) => {
                    reader.onloadend = () => {
                        const base64Pdf = reader.result.split(',')[1]; // Get base64 part
                        resolve(base64Pdf);
                    };
                    reader.onerror = reject;
                });
            } else {
                console.error("Error generating PDF:", await response.text());
                throw new Error('PDF conversion failed');
            }
        }
    }
  
    customElements.define("com-indirasai-sap-outlookwidget", outlookwidgetWidget);
})();
