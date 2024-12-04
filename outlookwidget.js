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
          const sendGridApiKey = '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'; // Replace with your actual SendGrid API key
          const emailData = {
              personalizations: [{
                  to: [{ email: this._props.email }],
                  subject: this._props.subject
              }],
              from: { email: 'indirasai.bollepalli@nagarro.com' }, // Your email address
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
          // You can integrate an API like html2pdf or use any server-side solution to convert HTML to PDF.
          // For now, let's assume you have an API that converts HTML to PDF and returns a Base64 encoded string.
          const response = await fetch('https://your-pdf-conversion-api-url', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ html: content })
          });
          
          const data = await response.json();
          return data.base64Pdf; // Assuming your PDF conversion API returns the PDF as a Base64 string
      }
  }

  customElements.define("com-indirasai-sap-outlookwidget", outlookwidgetWidget);
})();
