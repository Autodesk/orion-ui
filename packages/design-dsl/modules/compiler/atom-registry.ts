import { IAtomDb } from './types';


export interface Validation {
  isElementAllowedAttribute?: boolean;
  isAtomicAttribute: boolean;
  isValidAtomValue?: boolean;
  validValues?: string[];
}

export default class AtomRegistry {
  private atoms: IAtomDb;

  constructor(atoms: IAtomDb) {
    this.atoms = atoms;
  }

  /**
   * Given an element name, an attribute name, and an atom name check if
   * the atom is allowed and the attribute is atomic
   */
  validate(elementName: string, attributeName: string, atom: string): Validation {
    const element = this.atoms.elements[elementName];

    // Guard unknown element
    if (!element) {
      throw new Error('unknown element type');
    }

    const matchedAttr = element.attributes.find(attr => attr === attributeName)
    const isAtomicAttribute = (this.atoms.byAttribute[attributeName]) ? true : false;

    // Case: not even an atomic attribute
    if (!isAtomicAttribute) {
      return {
        isAtomicAttribute: false
      }
    }

    // Case: an atomic attribute, but not allowed on this element
    if (!matchedAttr) {
      return {
        isAtomicAttribute: true,
        isElementAllowedAttribute: false
      }
    }

    // Case: atomic attribute and allowed
    const validValues = Object.keys(this.atoms.byAttribute[attributeName]);
    const matchedValue = validValues.find(value => value === atom);

    // Case: valid atomic value
    if (matchedValue) {
      return {
        isAtomicAttribute: true,
        isElementAllowedAttribute: true,
        isValidAtomValue: true
      }
    } else {
      // Case: invalid atomic value
      return {
        isAtomicAttribute: true,
        isElementAllowedAttribute: true,
        isValidAtomValue: false,
        validValues
      }
    }
  }
}