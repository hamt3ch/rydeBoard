export default class Util {
  static handleError(response, error, status = 500) { // error will be a custom string or an object
    response.status(status);
    if (typeof error === 'string') {
      response.send({ message: error });
    } else {
      response.send({ message: error.message });
    }
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

    if (count < 4) return false;
    return true;
  }
}
