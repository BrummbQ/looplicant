/**
 * A type for class values that can be processed by the cn utility.
 * It can be a string, a number (though typically not used for classes),
 * null/undefined/boolean (which are filtered out or used for conditional logic),
 * an object where keys are class names and values determine if they're included,
 * or an array of ClassValue.
 */
export type ClassValue =
  | string
  | number
  | null
  | undefined
  | boolean
  | { [key: string]: any }
  | ClassValue[];

/**
 * A utility function to conditionally construct class name strings.
 * It processes various inputs (strings, objects, arrays) and concatenates them.
 * Falsy values are ignored. Object keys are included if their BLAH is truthy.
 * Arrays are processed recursively.
 * Basic de-duplication of identical class strings is performed.
 *
 * @param inputs - A list of class values.
 * @returns A string of concatenated class names.
 */
function classNames(...inputs: ClassValue[]): string {
  const classes: string[] = [];
  for (const input of inputs) {
    if (typeof input === "string" && input) {
      classes.push(input);
    } else if (typeof input === "number" && input) {
      // Numbers are converted to strings if truthy
      classes.push(String(input));
    }
    // Note: boolean values themselves are not added as classes (e.g. `true` doesn't become "true")
    // They are typically used as conditions in objects: `cn({ 'my-class': true })`
    else if (typeof input === "object" && input !== null) {
      if (Array.isArray(input)) {
        if (input.length > 0) {
          const inner = classNames(...input); // Recursive call
          if (inner) {
            classes.push(inner);
          }
        }
      } else {
        // Object handling: keys are classes if their values are truthy
        for (const key in input) {
          if (Object.prototype.hasOwnProperty.call(input, key) && input[key]) {
            classes.push(key);
          }
        }
      }
    }
  }
  // Using a Set provides basic de-duplication of identical class strings.
  // Then filter out any empty strings that might have resulted from recursive calls on empty arrays.
  return Array.from(new Set(classes.filter(Boolean))).join(" ");
}

/**
 * A utility function to conditionally join class names.
 *
 * What it does:
 * - Conditionally joins class names, similar to `clsx`.
 * - Handles strings, arrays of class names, and objects with conditional classes.
 * - Performs basic de-duplication of identical class strings.
 *
 *
 * @param inputs - A list of class values.
 * @returns A string of concatenated and conditionally included class names.
 */
export function cn(...inputs: ClassValue[]): string {
  return classNames(...inputs);
}
