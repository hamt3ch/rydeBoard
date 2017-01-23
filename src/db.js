import mongoose from 'mongoose'

export default callback => {
	var url = 'mongodb://admin:hacks@ds019946.mlab.com:19946/ryde-board'
	mongoose.connect(url, (err) => {
  	console.log("Connected successfully to server w/ mongoose");
	});

	callback(mongoose);
	
}
