import {registerDecorator, ValidationArguments, IsUUID} from "class-validator";

/**
 * A custom class-validator decorator to ensure a given field is an array of entity IDs (UUID strings)
 *
 * @constructor
 */
export function IsUUIDArray() {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: "IsUUIDArray",
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: "$property must be an array of entity IDs"
      },
      validator: {
        validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
          // Check if array
          if (!Array.isArray(value)) {
            return false;
          }

          // Check if array of string UUIDs
          for (const item of value) {
            if (!IsUUID(item)) {
              return false;
            }
          }

          return true;
        }
      }
    })
  }
}