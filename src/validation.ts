export enum ValidationType {
  Required = 'required',
  Number = 'number',
  Year = 'year',
}

export interface ValidationStrategy {
  validate(value: string): boolean;
  message: string;
}

export class RequiredValidator implements ValidationStrategy {
  validate(value: string): boolean {
    return value.trim() !== '';
  }
  message: string = "Обов'язкове значення";
}

export class NumberValidator implements ValidationStrategy {
  validate(value: string): boolean {
    return /^\d+$/.test(value);
  }
  message: string = 'Значення має бути числом';
}

export class YearValidator implements ValidationStrategy {
  validate(value: string): boolean {
    const currentYear = new Date().getFullYear();
    const isValidFormat = /^\d{4}$/.test(value);

    if (!isValidFormat) {
      return false;
    }

    const year = parseInt(value, 10);
    return year <= currentYear;
  }
  message: string = 'Введіть коректний рік';
}

export class ValidatorSelector {
  private static validators: { [key in ValidationType]: ValidationStrategy } = {
    [ValidationType.Required]: new RequiredValidator(),
    [ValidationType.Number]: new NumberValidator(),
    [ValidationType.Year]: new YearValidator(),
  };

  static select(validationType: ValidationType): ValidationStrategy {
    return this.validators[validationType];
  }
}

export class FormValidator {
  public validateForm(formId: string): boolean {
    const form = document.getElementById(formId) as HTMLFormElement;
    const inputs = form.querySelectorAll('[data-validation]');

    let isValid = true;

    inputs.forEach((input) => {
      const validationTypes = input
        .getAttribute('data-validation')
        ?.split(',') as ValidationType[];
      const value = (input as HTMLInputElement).value;

      validationTypes.forEach((validationType) => {
        const validator = ValidatorSelector.select(validationType);

        if (!validator.validate(value)) {
          isValid = false;
          const errorElement = document.getElementById(`${input.id}-error`);
          if (errorElement) {
            errorElement.textContent = validator.message;
            errorElement.style.display = 'block';
          }
        } else {
          const errorElement = document.getElementById(`${input.id}-error`);
          if (errorElement) {
            errorElement.style.display = 'none';
          }
        }
      });
    });

    return isValid;
  }
}
