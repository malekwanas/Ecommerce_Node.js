const express = require("express");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
const methodOverride = require("method-override");

require("dotenv").config();
const mongoose = require("mongoose");
const Seller = require("./models/seller");
const Product = require("./models/product");
const User = require("./models/user");
const Order = require("./models/order");

const app = express();
app.use(methodOverride("_method"));
const dbURL =
  "mongodb+srv://malekwanas:EcommerceProject@ecommercecluster.cype2dr.mongodb.net/EcommerceDB";

mongoose
  .connect(dbURL)
  .then(() => {
    console.log("Connected to MongoDB");
    //createProducts(); -----> Called only once to create products
  })
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

function createProducts() {
  // Function to generate random price between min and max
  function getRandomPrice(min, max) {
    return Math.random() * (max - min) + min;
  }

  for (let i = 1; i <= 5; i++) {
    const product = new Product({
      name: `Product ${i}`,
      description: `Description for Product ${i}`,
      photo: "url_to_photo",
      seller: "662265fee1d420037f6235ad", // Seller Malek's _id
      CreationDate: new Date(),
      Price: getRandomPrice(20, 40),
    });
    product
      .save()
      .then(() => console.log(`Product ${i} for Malek saved`))
      .catch((err) =>
        console.error(`Error saving product ${i} for Malek:`, err)
      );
  }

  for (let i = 6; i <= 10; i++) {
    const product = new Product({
      name: `Product ${i}`,
      description: `Description for Product ${i}`,
      photo: "url_to_photo",
      seller: "66226687e1d420037f6235ae", // Seller Wanas's _id
      CreationDate: new Date(),
      Price: getRandomPrice(20, 40),
    });

    product
      .save()
      .then(() => console.log(`Product ${i} for Wanas saved`))
      .catch((err) =>
        console.error(`Error saving product ${i} for Wanas:`, err)
      );
  }
}

app.set("view engine", "ejs");
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//----------------------------------------------------
app.get("/", (req, res) => {
  res.redirect("/Choose");
});
//----------------------------------------------------
app.get("/Choose", (req, res) => {
  res.render(`${__dirname}\/views\/Choose`, { title: "Welcome" });
});
//----------------------------------------------------
app.get("/Home", (req, res) => {
  res.render(`${__dirname}\/views\/Choose`, { title: "Welcome" });
});

//----------------------------------------------------
app.get("/UserLogin", (req, res) => {
  res.render(`${__dirname}\/views\/UserLogin`, { title: "User Login" });
});

//----------------------------------------------------
app.post("/user/login", async (req, res) => {
  const username = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ email: username, password: password });

    if (!user) {
      return res.status(401).send("Invalid email or password");
    }

    const accessToken = jwt.sign(
      { email: user.email },
      process.env.ACCESS_TOKEN_SECRET
    );

    // Redirect to products for users
    res.redirect(`/products?token=${accessToken}`);
  } catch (error) {
    console.error(error);
  }
});

//----------------------------------------------------
app.get("/SellerLogin", (req, res) => {
  res.render(`${__dirname}\/views\/SellerLogin`, { title: "Seller Login" });
});

//----------------------------------------------------
app.post("/seller/login", async (req, res) => {
  const username = req.body.email;
  const password = req.body.password;

  try {
    const seller = await Seller.findOne({
      email: username,
      password: password,
    });

    if (!seller) {
      return res.status(401).send("Invalid email or password");
    }

    const accessToken = jwt.sign(
      { email: seller.email },
      process.env.ACCESS_TOKEN_SECRET
    );

    // Redirect to SellerProducts for sellers
    res.redirect(`/SellerProducts?token=${accessToken}`);
  } catch (error) {
    console.error(error);
  }
});
//----------------------------------------------------
app.get("/SellerProducts", async (req, res) => {
  const token = req.query.token; // Get the token from the query parameters
  try {
    // Decode the token to get seller information
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const sellerEmail = decoded.email;

    // Find the seller based on decoded email
    const seller = await Seller.findOne({ email: sellerEmail });

    if (!seller) {
      return res.status(404).send("Seller not found");
    }

    // Find products belonging to the seller
    const products = await Product.find({ seller: seller._id })
      .populate("seller")
      .sort({ name: 1 });

    res.render(`${__dirname}\/views\/SellerProducts`, {
      prds: products,
      title: "Seller Products",
      token: token,
      sellerId: seller._id,
      decoded: decoded,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
//----------------------------------------------------
app.get("/search/ProductsForSeller", async (req, res) => {
  const searchTerm = req.query.term;
  const token = req.query.token;

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const seller = await Seller.findOne({ email: decoded.email });

    if (!seller) {
      return res.status(404).send("Seller not found");
    }

    let products;
    let title;
    if (!searchTerm) {
      products = await Product.find({ seller: seller._id }).populate("seller");
      title = "All Products";
    } else {
      products = await Product.find({
        seller: seller._id,
        name: { $regex: searchTerm, $options: "i" },
      }).populate("seller");
      title = "Search Results";
    }

    res.render(`${__dirname}\/views\/SellerProducts`, {
      prds: products,
      title: title,
      token: token,
      sellerId: seller._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

//----------------------------------------------------
app.get(`/products`, (req, res) => {
  const token = req.query.token; // Get the token from the query parameters

  Product.find()
    .populate("seller")
    .sort({ name: 1 })
    .then((products) => {
      res.render(`${__dirname}\/views\/products`, {
        prds: products,
        title: "Products Page",
        token: token,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

//----------------------------------------------------
app.get("/userinfo", async (req, res) => {
  const token = req.query.token;

  try {
    if (!token) {
      return res.status(401).send("Unauthorized");
    }

    // Decode the token to get user information
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userEmail = decoded.email;

    // Find the user based on the decoded email
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Render the UserInfo view with user data
    res.render(`${__dirname}\/views\/UserInfo`, {
      title: "User Information",
      user: user,
      token: token,
    });
  } catch (error) {
    console.error(error);
  }
});

//----------------------------------------------------
app.post("/EditInfo", async (req, res) => {
  const { email, name, age, country, password } = req.body;

  try {
    let updateFields = {};

    // Check if each field exists in the request body and add it to the updateFields object
    if (name) updateFields.name = name;
    if (age) updateFields.age = age;
    if (country) updateFields.Country = country;
    if (password) updateFields.password = password;

    await User.updateOne({ email: email }, updateFields);

    // Get the token from the request body or query parameters
    const token = req.body.token || req.query.token;

    // Redirect to products page with the token
    res.redirect(`/products?token=${token}`);
  } catch (error) {
    res.status(500).send("Failed to update user information!");
  }
});

//----------------------------------------------------
app.get("/search", async (req, res) => {
  const searchTerm = req.query.term;
  const token = req.query.token; // Get the token from the query parameters

  try {
    if (!searchTerm) {
      // If searchTerm is empty, render the products page without performing the search
      const products = await Product.find().populate("seller");

      res.render(`${__dirname}\/views\/products`, {
        prds: products,
        title: "All Products",
        token: token,
      });
      return;
    }

    const productsByName = await Product.find({
      name: { $regex: searchTerm, $options: "i" },
    }).populate("seller");

    const seller = await Seller.findOne({
      name: { $regex: searchTerm, $options: "i" },
    });

    // If a seller is found, find products associated with that seller
    const productsBySeller = seller
      ? await Product.find({ seller: seller._id }).populate("seller")
      : [];

    // Combine the search results from name search and seller search
    const searchResults = [...productsByName, ...productsBySeller];

    res.render(`${__dirname}\/views\/products`, {
      prds: searchResults,
      title: "Search Results",
      token: token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});
//----------------------------------------------------
app.get("/logout", (req, res) => {
  res.redirect("/Home");
});
//----------------------------------------------------
app.get("/Orders", async (req, res) => {
  const token = req.query.token;

  if (!token) {
    return res.status(401).send("Unauthorized: Token is missing");
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userEmail = decoded.email;

    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).send("User not found");
    }

    const orders = await Order.find({ user: user._id })
      .populate("user")
      .populate("seller")
      .populate("product");

    console.log("Orders found:", orders.length);

    res.render(`${__dirname}\/views\/Orders`, {
      title: "Orders Page",
      token: token,
      ord: orders,
      user: user,
    });
  } catch (err) {
    console.error("Error:", err);
  }
});
//----------------------------------------------------
app.get("/SellerInfo", async (req, res) => {
  const token = req.query.token;
  console.log("Token:", token);

  try {
    if (!token) {
      return res.status(401).send("Unauthorized");
    }

    // Decode the token to get seller information
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("Decoded:", decoded);

    const sellerEmail = decoded.email;
    console.log("Seller Email:", sellerEmail);
    console.log("Decoded Email:", decoded.email);

    // Find the seller based on the decoded email
    const seller = await Seller.findOne({ email: sellerEmail });
    console.log("Seller:", seller);

    if (!seller) {
      return res.status(404).send("Seller not found");
    }

    // Render the SellerInfo view with seller data
    res.render(`${__dirname}\/views\/SellerInfo`, {
      title: "Seller Information",
      seller: seller, // Pass seller instead of user
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

//----------------------------------------------------
app.post("/EditInfoSeller", async (req, res) => {
  const { email, name, password } = req.body;

  try {
    let updateFields = {};

    // Check if each field exists in the request body and add it to the updateFields object
    if (email) updateFields.email = email;
    if (name) updateFields.name = name;
    if (password) updateFields.password = password;

    await Seller.updateOne({ email: email }, updateFields);

    // Get the token from the request body or query parameters
    const token = req.body.token || req.query.token;

    // Redirect to products page with the token
    res.redirect(`/SellerProducts?token=${token}`);
  } catch (error) {
    res.status(500).send("Failed to update user information!");
  }
});
//----------------------------------------------------
app.post("/EditProduct", async (req, res) => {
  const { productId, name, description, price } = req.body;

  try {
    let updateFields = {};

    // Check if each field exists in the request body and add it to the updateFields object
    if (name) updateFields.name = name;
    if (description) updateFields.description = description;
    if (price) updateFields.Price = price;

    const result = await Product.updateOne({ _id: productId }, updateFields);

    // Get the token from the request body or query parameters
    const token = req.body.token || req.query.token || "";

    // Redirect to products page with the token
    res.redirect(`/SellerProducts?token=${token}`);
  } catch (error) {
    console.error("Error updating product:", error);
  }
});
//----------------------------------------------------
app.post("/AddProduct", async (req, res) => {
  try {
    const { name, description, CreationDate, photo, seller } = req.body;

    const newProduct = new Product({
      name: name,
      description: description,
      Price: parseFloat(req.body.Price),
      seller: seller,
      CreationDate: CreationDate,
      photo: photo,
    });

    await newProduct.save();

    res.redirect(`/SellerProducts?token=${req.body.token}`);
  } catch (error) {
    console.error("Error adding product:", error);
  }
});
//----------------------------------------------------
app.delete("/DeleteProduct", async (req, res) => {
  try {
    const productId = req.body.productId;
    const token = req.body.token;

    await Product.findByIdAndDelete(productId);

    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the product" });
  }
});

//----------------------------------------------------
app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});
