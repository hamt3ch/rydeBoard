export default class Util {
  // TODO: fill out error handling for all requests
  static handleError(err) {
    console.log(err);
  }

  static allFieldsValid(body) {
    let count = 0;
    /* eslint no-restricted-syntax: 0 */
    for (const field in body) {
      // check if any fields are empty
      if (body[field] === '') {
        return false;
      }
      count += 1;
    }

    if (count !== 5) {
      return false;
    }

    return true;
  }
}
