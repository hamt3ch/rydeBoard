import node_geocoder from 'node-geocoder';
var geo_options = {
  provider: 'google',
};

export default node_geocoder(geo_options);
