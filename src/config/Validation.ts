class Validation {
  existsOrError(value: any, msg: string) {
    if (!value) { throw msg; }

    if (Array.isArray(value) && value.length === 0) { throw msg; }

    if (typeof value === 'string' && !value.trim()) { throw msg; }
  }

  notExistsOrError(value: any, msg: string) {
    try {
      this.existsOrError(value, msg);
    } catch (msg) {
      return;
    }

    throw msg;
  }

  equalsOrError(valueA: any, valueB: any, msg: string) {
    if (valueA !== valueB) { throw msg; }
  }
}

export default Validation;
