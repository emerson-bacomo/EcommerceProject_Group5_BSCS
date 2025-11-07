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
            if (!isNaN(newParsedValue)) {
                const clampedValue = Math.min(Math.max(newParsedValue, 1), 99);
                this._value = clampedValue;
            }
            this.updateInput();
        }
    }
    get value() {
        return this._value;
    }
    set value(newValue) {
        const newParsedValue = parseInt(newValue, 10);
        if (!isNaN(newParsedValue)) {
            const clampedValue = Math.min(Math.max(newParsedValue, 1), 99);
            if (this._value !== clampedValue) {
                this._value = clampedValue;
                this.setAttribute("value", clampedValue);
                this.updateInput();
                this.dispatchEvent(new CustomEvent("change", { detail: { value: clampedValue } }));
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
                    height: 30px;
                    border: 1px solid #dee2e6;
                    border-radius: var(--bs-border-radius, 0.375rem);
                    overflow: hidden;
                    max-width: 200px;
                }
                .input-group button {
                    border: none;
                    background-color: #f8f9fa;
                    cursor: pointer;
                    height: 100%;
                    font-size: 1rem;
                    flex-shrink: 0;
                    border-right: 1px solid #dee2e6;
                    padding: 0 0.5rem;
                    line-height: 30px;
                }
                .input-group button:last-child {
                    border-right: none;
                    border-left: 1px solid #dee2e6;
                }
                .input-group button:hover {
                    background-color: #e9ecef;
                }
                .quantity-input {
                    width: 100%;
                    text-align: center;
                    height: 100%;
                    border: none;
                    font-size: 14px;
                    padding: 0;
                    line-height: 30px;
                    min-width: 0px;
                    -moz-appearance: textfield;
                }

                @media (max-width: ${mobileMaxWidthPlus1}px) {
                    .input-group {
                        max-width: 100px;
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
