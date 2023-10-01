export class NonMatchingValuesException extends Error {
    constructor() {
        super("Non matching values between metrics and carbon intensities.");
    }
}