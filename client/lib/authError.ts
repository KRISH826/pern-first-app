export function mapAuthError(error: unknown): string {
    if (!(error instanceof Error)) {
        return "Something went wrong. Please try again.";
    }

    switch (error.name) {
        // ---- SIGN IN ----
        case "NotAuthorizedException":
            return "Incorrect email or password.";

        case "UserNotFoundException":
            return "No account found with this email.";

        case "UserNotConfirmedException":
            return "Please verify your email before signing in.";

        // ---- SIGN UP ----
        case "UsernameExistsException":
            return "An account with this email already exists.";

        case "InvalidPasswordException":
            return "Password does not meet security requirements.";

        case "InvalidParameterException":
            return "Invalid input. Please check your details.";

        // ---- VERIFY / OTP ----
        case "CodeMismatchException":
            return "Invalid verification code.";

        case "ExpiredCodeException":
            return "Verification code expired. Please resend.";

        // ---- RESET PASSWORD ----
        case "LimitExceededException":
            return "Too many attempts. Please try again later.";

        default:
            return error.message || "Authentication failed.";
    }
}
