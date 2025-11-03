import { mobileMaxWidthPlus1 } from "../config/general.js";
import { html } from "../utils/helpers.js";

class QuantityPicker extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._value = parseInt(this.getAttribute("value") || "1", 10);
        if (isNaN(this._value) || this._value < 1) this._value = 1;
    }
    connectedCallback() {
        this.render();
        this.addEventListeners();
    }
    static get observedAttributes() {
        return ["value"];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "value" && oldValue !== newValue) {
            const newParsedValue = parseInt(newValue, 10);
            if (!isNaN(newParsedValue) && newParsedValue >= 1) {
                this._value = newParsedValue;
                this.updateInput();
            } else if (this.shadowRoot.querySelector("input")) {
                this.updateInput();
            }
        }
    }
    get value() {
        return this._value;
    }
    set value(newValue) {
        const newParsedValue = parseInt(newValue, 10);
        if (!isNaN(newParsedValue) && newParsedValue >= 1) {
            if (this._value !== newParsedValue) {
                this._value = newParsedValue;
                this.setAttribute("value", this._value);
                this.updateInput();
                this.dispatchEvent(new CustomEvent("change", { detail: { value: this._value } }));
            }
        } else {
            this.updateInput();
        }
    }
    updateInput() {
        const input = this.shadowRoot.querySelector(".quantity-input");
        if (input) input.value = this._value;
    }
    render() {
        this.shadowRoot.innerHTML = html`
            <style>
                .input-group {
                    display: flex;
                    width: 100%;
                    border: 1px solid #dee2e6;
                    border-radius: var(--bs-border-radius, 0.375rem);
                    overflow: hidden;
                    max-width: 200px;
                }
                .input-group button {
                    border: none;
                    background-color: #f8f9fa;
                    padding: 0.375rem 0.75rem;
                    cursor: pointer;
                    font-size: 1rem;
                    line-height: 1.5;
                    flex-shrink: 0;
                    border-right: 1px solid #dee2e6;
                }
                .input-group button:last-child {
                    border-right: none;
                    border-left: 1px solid #dee2e6;
                }
                .input-group button:hover {
                    background-color: #e9ecef;
                }
                .quantity-input {
                    flex-grow: 1;
                    text-align: center;
                    border: none;
                    padding: 0.375rem 0.5rem;
                    font-size: 1rem;
                    line-height: 1.5;
                    min-width: 30px;
                    -moz-appearance: textfield;
                }

                @media (max-width: ${mobileMaxWidthPlus1}px) {
                    .quantity-input {
                        max-width: 2rem;
                    }
                }

                input[type="number"]::-webkit-outer-spin-button,
                input[type="number"]::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
            </style>
            <div class="input-group input-group-sm">
                <button class="btn-quantity-minus" type="button">-</button>
                <input type="number" class="quantity-input" value="${this._value}" aria-label="Quantity" min="1" />
                <button class="btn-quantity-plus" type="button">+</button>
            </div>
        `;
    }
    addEventListeners() {
        const minusBtn = this.shadowRoot.querySelector(".btn-quantity-minus");
        const plusBtn = this.shadowRoot.querySelector(".btn-quantity-plus");
        const input = this.shadowRoot.querySelector(".quantity-input");
        minusBtn.addEventListener("click", () => {
            if (this.value > 1) this.value = this.value - 1;
        });
        plusBtn.addEventListener("click", () => {
            this.value = this.value + 1;
        });
        input.addEventListener("change", (e) => {
            this.value = e.target.value;
        });
    }
}
customElements.define("quantity-picker", QuantityPicker);
