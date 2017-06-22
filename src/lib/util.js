function formatCoordinateQuery(coords) {
  return {
    $near: {
      $geometry: {
        type: 'Point',
        coordinates: coords,
      },
      $maxDistance: 1,
    },
  };
}

export default class Util {
  static handleError(response, error, status = 500) { // error will be a custom string or an object
    response.status(status);
    if (typeof error === 'string') {
      return response.send({ message: error });
    }
    return response.send({ message: error.message });
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

    if (count < 3) return false;
    return true;
  }

  /*
    Any other formatting should be down in this method
    when translating a url into mongo query
  */
  static formatQuery(body) {
    const formattedBody = {};
    const coordsArr = [];

    // Format query for departures coordinates
    if (body.departure_coordinate != null) {
      const departureQuery = JSON.parse(body.departure_coordinate);
      console.log(formatCoordinateQuery(departureQuery));
      coordsArr.push({ departure_coordinate: formatCoordinateQuery(departureQuery)});
      // formattedBody.departure_coordinate = formatCoordinateQuery(departureQuery);
    }

    // Format query for arrival coordinates
    if (body.arrival_coordinate != null) {
      const arrivalQuery = JSON.parse(body.arrival_coordinate);
      console.log(formatCoordinateQuery(arrivalQuery));
      coordsArr.push({ arrival_coordinate: formatCoordinateQuery(arrivalQuery)});
      // formattedBody.arrival_coordinate = formatCoordinateQuery(arrivalQuery);
    }

    formattedBody.$and = coordsArr;
    console.log(formattedBody);
    return formattedBody;
  }
}
