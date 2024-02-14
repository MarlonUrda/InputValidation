class InputVal extends HTMLElement {
  constructor() {
    super();
    this.type = this.getAttribute("type") || "text";
  }

  connectedCallback() {
    this.attachShadow({ mode: "open" });

    const inp = document.createElement("input");
    inp.setAttribute("type", this.type);

    this.shadowRoot.appendChild(inp);

    inp.addEventListener("input", () => {
      this.validateInput(inp.value, this.type);
    });
  }

  validateInput(value, type) {
    let isValid = false;

    switch (type) {
      case "text":
        isValid = value.trim().length > 0;
        break;
      case "number":
        isValid = !isNaN(value) && value.trim() !== "";
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(value);
        break;
      case "integer":
        if (!isNaN(value)) {
          const num = parseFloat(value);
          if (num.toString().split(".").length - 1 === 0) {
            isValid = true;
          } else {
            isValid = false;
          }
        }
      default:
        isValid = true;
    }

    if (isValid) {
      this.shadowRoot.querySelector("input").style.border = "2px solid green";
    } else {
      this.shadowRoot.querySelector("input").style.border = "2px solid red";
    }
  }
}

customElements.define("input-custom", InputVal);
