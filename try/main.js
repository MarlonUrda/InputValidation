class FormValidator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.form = this.shadowRoot.querySelector("form");
    this.form.addEventListener("submit", this.handleSubmit.bind(this));

    // Agregar event listener para el evento 'input' a cada campo de entrada
    const inputs = Array.from(this.form.elements);
    inputs.forEach((input) => {
      input.addEventListener("input", this.handleInput.bind(this));
    });
  }

  handleInput(event) {
    // Actualizar la validez del campo de entrada cuando cambia su valor
    this.validateInput(event.target);
  }

  handleSubmit(event) {
    event.preventDefault();
    let isValid = true;

    const inputs = Array.from(this.form.elements);
    inputs.forEach((input) => {
      if (!this.validateInput(input)) {
        isValid = false;
      }
    });

    if (isValid) {
      console.log("Form is valid");
      // Aquí puedes manejar el envío del formulario
    } else {
      console.log("Form is not valid");
      // Forzar la actualización de la validación del formulario
      inputs.forEach((input) => {
        input.reportValidity();
      });
    }
  }

  validateInput(input) {
    const type = input.getAttribute("validate-type");
    let isValid = true;

    switch (type) {
      case "empty":
        if (input.value.trim().length === 0) {
          input.setCustomValidity("Este campo no puede estar vacio.");
          isValid = false;
        } else {
          input.setCustomValidity("");
        }
        break;
      case "number":
        if (
          !Number.isInteger(Number(input.value)) &&
          input.value.trim() !== ""
        ) {
          input.setCustomValidity("Este campo solo acepta numeros enteros");
          isValid = false;
        } else {
          input.setCustomValidity("");
        }
        break;
      case "real":
        const regex = /^-?\d*\.?\d+$/;
        if (regex.test(input.value) === false && input.value.trim() !== "") {
          input.setCustomValidity("Este campo solo puede aceptar numeros.");
          isValid = false;
        } else {
          input.setCustomValidity("");
        }
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(input.value) === false) {
          input.setCustomValidity(
            "Este campo solo acepta correos electronicos validos."
          );
          isValid = false;
        } else {
          input.setCustomValidity("");
        }
        break;
      default:
        input.setCustomValidity("");
    }

    return isValid;
  }

  render() {
    this.shadowRoot.innerHTML = `
          <style>
              form {
                background-color: #333;
                color: #fff;
                padding: 20px;
                border-radius: 5px;
                width: 300px;
                margin: 0 auto;
              }
              input {
                  display: block;
                  width: 100%;
                  padding: 10px;
                  margin-bottom: 10px;
                  border-radius: 5px;
                  border: none;
                  background-color: transparent;
                  color: white;
              }
              button {
                display: block;
                width: 100%;
                padding: 10px;
                border: none;
                border-radius: 5px;
                background-color: #4CAF50;
                color: white;
                cursor: pointer;
              }
              button:hover {
                  background-color: #45a049;
              }
              .error { border: 1px solid red; }
          </style>

          <form>
              Vacio: <input type="text" placeholder="Input vacío" validate-type="empty"> <br>
              <br>
              Numero Entero: <input type="number" step="1" placeholder="Número entero" validate-type="number"> <br>
              <br>
              Numero Real: <input type="text" placeholder="Número real" validate-type="real"> <br>
              <br>
              Correo Electronico: <input type="email" placeholder="Correo electrónico" validate-type="email"> <br>
              <br>
              <button type="submit">Submit</button>
          </form>
      `;
  }
}

window.customElements.define("form-validator", FormValidator);
