
import { ValidatorFn, FormGroup, ValidationErrors } from '@angular/forms';
import Joi, { ObjectSchema } from 'joi'
import * as spanishMessages from './translation/es_ES.json';

export function createValidatorFromSchema(schema: ObjectSchema) {
  const validator = (group: FormGroup): ValidationErrors | null => {
    // This is where the validation on the values of
    // the form group is run.
    const result = schema.validate(group.value, {
      abortEarly: false,
      messages:  spanishMessages
      }
    );

    if (result.error) {
      // Create an object to hold the errors
      const errorObj: ValidationErrors = {};

      // Loop through the Joi error details and
      // create an object that Angular can use
      // to display the errors in the form.
      result.error.details.forEach((error) => {
        // Get the field name
        const path = error.path as string[];
        const field = path.join('.');

        // Set the error message
        errorObj[field] = error.message;
      });

      for (const key in errorObj) {
        const control = group.get(key);
        if (control) {
          control.setErrors({ joiError: errorObj[key] });
        }
      }

      // Return the error object so that we can access
      // the form’s errors via `form.errors`./*  */
      return errorObj;
    } else {
      return null;
    }
  };

  return validator;
}
