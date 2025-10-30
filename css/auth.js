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

        .form-control:focus {
            box-shadow: 0 0 0 0.2rem rgba(var(--bs-primary-rgb), 0.25);
            border-color: #86b7fe;
        }

        .password-toggle {
            cursor: pointer;
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(50%);
            color: #6c757d;
        }
    </style>
`;
