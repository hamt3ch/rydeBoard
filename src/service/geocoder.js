import nodeGeocoder from 'node-geocoder';

const geoOptions = {
  provider: 'google',
};

export default nodeGeocoder(geoOptions);
