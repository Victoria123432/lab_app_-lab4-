import {
  RequiredValidator,
  NumberValidator,
  YearValidator,
  ValidationType,
  ValidatorSelector,
} from '../src/validation';

describe('Validation Tests', () => {
  describe('RequiredValidator', () => {
    const requiredValidator = new RequiredValidator();

    it('should return true for non-empty values', () => {
      const result = requiredValidator.validate('test');
      if (!result) {
        throw new Error('Expected true for non-empty value');
      }
    });

    it('should return false for empty values', () => {
      const result = requiredValidator.validate('');
      if (result) {
        throw new Error('Expected false for empty value');
      }
    });
  });

  describe('NumberValidator', () => {
    const numberValidator = new NumberValidator();

    it('should return true for numeric values', () => {
      const result = numberValidator.validate('123');
      if (!result) {
        throw new Error('Expected true for numeric value');
      }
    });

    it('should return false for non-numeric values', () => {
      const result = numberValidator.validate('abc');
      if (result) {
        throw new Error('Expected false for non-numeric value');
      }
    });
  });

  describe('YearValidator', () => {
    const yearValidator = new YearValidator();
    const currentYear = new Date().getFullYear();

    it('should return true for valid years', () => {
      const resultCurrentYear = yearValidator.validate(currentYear.toString());
      const resultValidYear = yearValidator.validate('2000');
      if (!resultCurrentYear || !resultValidYear) {
        throw new Error('Expected true for valid years');
      }
    });

    it('should return false for invalid years', () => {
      const resultFutureYear = yearValidator.validate('2025');
      const resultNonNumeric = yearValidator.validate('abc');
      const resultShortYear = yearValidator.validate('99');
      if (resultFutureYear || resultNonNumeric || resultShortYear) {
        throw new Error('Expected false for invalid years');
      }
    });
  });

  describe('ValidatorSelector', () => {
    it('should return the correct validator for each validation type', () => {
      const requiredValidator = ValidatorSelector.select(
        ValidationType.Required
      );
      const numberValidator = ValidatorSelector.select(ValidationType.Number);
      const yearValidator = ValidatorSelector.select(ValidationType.Year);

      if (!(requiredValidator instanceof RequiredValidator)) {
        throw new Error('Expected instance of RequiredValidator');
      }
      if (!(numberValidator instanceof NumberValidator)) {
        throw new Error('Expected instance of NumberValidator');
      }
      if (!(yearValidator instanceof YearValidator)) {
        throw new Error('Expected instance of YearValidator');
      }
    });
  });
});
