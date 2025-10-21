const Product = require("../models/Product");

exports.addProduct = async (req, res) => {
	try {
	  const { name, description, price, image, discount, oldPrice } = req.body;
  
	  const newProduct = new Product({
		name,
		description,
		price,
		image,        
		discount,
		oldPrice
	  });
  
	  await newProduct.save();
  
	  res.status(200).send({ msg: "Product added successfully", newProduct });
  
	} catch (error) {
	  res.status(400).send({ msg: "Can not add product !!", error });
	}
  };
  

exports.getAllProduct = async (req, res) => {
	try {
		const listProducts = await Product.find();
		console.log("✅ Fetched products:", listProducts); // <--- Add this
		res.status(200).send({ msg: "this is the list off all products ..", listProducts });
	} catch (error) {
		console.error("❌ Error fetching products:", error); // <--- Optional
		res.status(400).send({ msg: " Can not get products !!", error });
	}
};


exports.getOneProduct = async (req, res) => {
	try {
		const productToGet = await Product.findOne({ _id: req.params.id });
		res.status(200).send({ msg: "I get th e product ..", productToGet });
	} catch (error) {
		res
			.status(400)
			.send({ msg: " Can not get the product with this id !!", error });
	}
};

exports.searchProducts = async (req, res) => {
  try {
    const { query } = req.query; // get search query from URL ?query=...

    // Case-insensitive regex search on product name
    const filteredProducts = await Product.find({
      name: { $regex: query, $options: "i" },
    });

    res.status(200).send({ msg: "Filtered products", filteredProducts });
  } catch (error) {
    res.status(400).send({ msg: "Cannot search products", error });
  }
};

exports.deleteProduct = async (req, res) => {
	try {
		const { _id } = req.params;
		await Product.findOneAndDelete({ _id });
		res.status(200).send({ msg: "Product deleted .." });
	} catch (error) {
		res.status(400).send({ msg: "Can not delete product !!", error });
	}
};

exports.editProduct = async (req, res) => {
	try {
		const { _id } = req.params;
		const result = await Product.updateOne({ _id }, { $set: { ...req.body } });
		res.status(200).send({ msg: "Product updated .." });
	} catch (error) {
		res
			.status(400)
			.send({ msg: "Can not update product with this id !!!", error });
	}
};
