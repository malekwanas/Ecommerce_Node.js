# Node.js eCommerce Project

![Node.js CI](https://github.com/your-username/your-repository/workflows/Node.js%20CI/badge.svg)

This is a Node.js eCommerce website where users can buy products. It includes features for managing products, sellers, orders, and user accounts.

## Features

### Product

- Products have a name, description, photo, seller, and creation date.
- Users can search for products using either the name or the seller.

### Seller

- Sellers have a name.
- Sellers can see, edit, delete, and create products.
- Each seller can see only their products.

### Order

- Each order has a creation date, products, and the user who made the order.

### Registered User

- Registered users can edit their own information.
- They can search for products.
- Users can make orders (buy products), and each order has products.

### Unregistered User (Anonymous)

- Unregistered users can view any product.
- They can't search for products.
- They can't make orders.

## Requirements

- Node.js
- MongoDB

## Installation

1. Clone the repository:
git clone https://github.com/your-username/your-repository.git

2. Navigate to the project directory:
cd your-repository

3. Install dependencies:
npm install

4. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the following environment variables to the `.env` file:
DB_USERNAME=malekwanas DB_PASSWORD=EcommerceProject

5. Start the server:
npm start


6. Access the application in your web browser at http://localhost:3000.

## Usage

- Register as a new user or log in as an existing user.
- Log in as a seller to manage products.
- Search for products using the search bar.
- View and buy products.
- View your orders.

## Contributing

Contributions are welcome! Feel free to submit pull requests or open issues.
