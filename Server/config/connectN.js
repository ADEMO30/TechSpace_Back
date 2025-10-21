// 1 - require mongoose
const mongoose = require("mongoose");

// 2 - create DB
const connectN = async () => {
	try {
		await mongoose.connect(process.env.ATLAS_URI);
		console.log("Database connected ..");
	} catch (error) {
		console.log("Cannot connect !!", error);
	}
};

// 3 - export
module.exports = connectN;
