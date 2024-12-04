(function () {
    let template = document.createElement("template");
    template.innerHTML = `
        <style>
            #form {
                font-family: Arial, sans-serif;
                width: 400px;
                margin: 0 auto;
            }

            table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 10px;
            }

            td {
                padding: 1px;
                text-align: left;
                font-size: 13px;
            }

            input {
                width: 100%;
                padding: 10px;
                border: 2px solid #ccc;
                border-radius: 5px;
                font-size: 13px;
                box-sizing: border-box;
                margin-bottom: 10px;
            }

            input[type="submit"] {
                background-color: #0078d4;
                color: white;
                padding: 10px;
                border: none;
                border-radius: 5px;
                font-size: 14px;
                cursor: pointer;
                width: 100%;
            }
        </style>
        <form id="form">
            <table>
                <tr>
                    <td>
                        <p>Email Address</p>
                        <input id="builder_email" type="email" placeholder="Enter Email Address">
                    </td>
                </tr>
                <tr>
                    <td>
                        <p>Subject</p>
                        <input id="builder_subject" type="text" placeholder="Enter Subject">
                    </td>
                </tr>
                <tr>
                    <td>
                        <p>Body</p>
                        <input id="builder_Body" type="text" placeholder="Enter Message">
                    </td>
                </tr>
                <tr>
                    <td>
                        <p>Caption</p>
                        <input id="builder_caption" type="text" placeholder="Enter Caption">
                    </td>
                </tr>
            </table>
            <input value="Update Settings" type="submit">
            <br>
        </form>
    `;
    
    class outlookwidgetWidgetBuilderPanel extends HTMLElement {
        constructor() {
            super();
            this._shadowRoot = this.attachShadow({ mode: "open" });
            this._shadowRoot.appendChild(template.content.cloneNode(true));

            // Attach event listener for the form submission
            this._shadowRoot.getElementById("form").addEventListener("submit", this._submit.bind(this));
        }

        // Method to handle form submission
        _submit(e) {
            e.preventDefault();
            this.dispatchEvent(
                new CustomEvent("propertiesChanged", {
                    detail: {
                        properties: {
                            email: this.email,
                            subject: this.subject,
                            Body: this.Body,
                            caption: this.caption
                        }
                    }
                })
            );
        }

        // Setters and getters for the form fields

        set email(_email) {
            this._shadowRoot.getElementById("builder_email").value = _email;
        }
        get email() {
            return this._shadowRoot.getElementById("builder_email").value;
        }

        set subject(_subject) {
            this._shadowRoot.getElementById("builder_subject").value = _subject;
        }
        get subject() {
            return this._shadowRoot.getElementById("builder_subject").value;
        }

        set Body(_Body) {
            this._shadowRoot.getElementById("builder_Body").value = _Body;
        }
        get Body() {
            return this._shadowRoot.getElementById("builder_Body").value;
        }

        set caption(_caption) {
            this._shadowRoot.getElementById("builder_caption").value = _caption;
        }
        get caption() {
            return this._shadowRoot.getElementById("builder_caption").value;
        }
    }

    // Define the custom element for the builder panel
    customElements.define("com-indirasai-sap-outlookwidget-builder", outlookwidgetWidgetBuilderPanel);
})();
