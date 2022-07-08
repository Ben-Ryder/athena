import {registerDecorator, ValidationArguments, IsUUID} from "class-validator";

/**
 * A custom class-validator decorator to ensure a given field is an array of entity IDs arrays (array of UUID strings)
 *
 * @constructor
 */
export function IsArrayOfUUIDArrays() {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: "IsArrayOfUUIDArrays",
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: "$property must be an array of entity ID arrays"
      },
      validator: {
        validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
          if (!Array.isArray(value)) {
            return false;
          }

          for (const entityIDArray of value) {
            if (!Array.isArray(entityIDArray)) {
              return false;
            }

            for (const uuid of entityIDArray) {
              if (!IsUUID(uuid)) {
                return false;
              }
            }
          }

          return true;
        }
      }
    })
  }
}