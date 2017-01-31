class Util {
  // TODO: fill out error handling for all requests
  static handleError(err) {
    console.log("the error: " + err);
  }

  static allFieldsValid(body) {
    let count = 0;
  	for (var field in body) {
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
export default Util;
