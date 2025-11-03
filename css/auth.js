import { mobileMaxWidthPlus1 } from "../js/config/general.js";
import { html } from "../js/utils/helpers.js";

export const authCss = html`
    <style>
        .auth-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 1rem;
        }

        .auth-card {
            width: 500px;
            border-radius: var(--bs-border-radius-lg);
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
            padding: 4rem 3rem;
            background: #fff;
        }

        .input-label {
            font-weight: 500;
            color: #212529;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.5rem;
            margin-bottom: 0.35rem;
        }

        .error-message {
            font-weight: 500;
            color: #dc3545;
            font-size: 0.875rem;
            opacity: 0;
            transition: opacity 0.2s ease;
        }

        .error-visible {
            opacity: 1;
        }

        .input-field {
            width: 100%;
            padding: 0.625rem 0.75rem;
            font-size: 1rem;
            border: 1px solid #ced4da;
            border-radius: 0.375rem;
            background-color: #fff;
            transition: border-color 0.2s, box-shadow 0.2s;
        }

        .input-field:focus {
            border-color: #0d6efd;
            box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.15);
            outline: none;
        }

        .input-error {
            border-color: red;
        }

        .password-toggle {
            cursor: pointer;
            position: absolute;
            right: 1rem;
            top: 50%;
            transform: translateY(50%);
            color: #6c757d;
        }

        .password-toggle:hover {
            color: #000;
        }

        @media (max-width: ${mobileMaxWidthPlus1}px) {
            .auth-card {
                padding: 1rem 1.25rem;
            }
        }
    </style>
`;
