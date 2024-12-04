(function() {
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
            let shadowRoot = this.attachShadow({
                mode: "open"
            });
            shadowRoot.appendChild(template.content.cloneNode(true));
            this._props = {};
            this.addEventListener("click", this.onClick.bind(this));
        }
        
        async connectedCallback() {
            this.initMain();
        }
        
        async initMain() {
            let email = this._props.email; // default value if email is not set
            let subject = this._props.subject; // default value if subject is not set
            let Body = this._props.Body;
            let caption = this._props.caption;

            this.shadowRoot.querySelector("#caption").textContent = caption;
        }

        onCustomWidgetBeforeUpdate(changedProperties) {
            this._props = {
                ...this._props,
                ...changedProperties
            };
        }

        onCustomWidgetAfterUpdate(changedProperties) {
            this.initMain();
        }

        async onClick() {
            // Fetch story content including widgets
            let storyContent = await this.getStoryContent();

            // Create the email body with story content
            let emailBody = `
                <h1>Story and Widgets Content</h1>
                <p>Below is the content of the SAP Analytics Cloud story:</p>
                <div>${storyContent}</div>
            `;

            // Format the email body for mailto
            let url = `mailto:${this._props.email}?subject=${encodeURIComponent(this._props.subject)}&body=${encodeURIComponent(emailBody)}`;
            
            window.open(url, "_blank");
        }

        async getStoryContent() {
            // This method retrieves the entire story content including all widgets
            // It fetches the HTML of the page and returns it.
            // You might need to fine-tune this based on your specific SAC environment setup.
            let content = document.body.innerHTML; // Grab entire body content (or use specific selectors)
            
            // Example: If you want to just grab a specific section of the page, use selectors
            // let content = document.querySelector('.specific-section').innerHTML;

            // You can clean or filter the content here if needed
            return content;
        }
    }

    customElements.define("com-indirasai-sap-outlookwidget", outlookwidgetWidget);
})();
