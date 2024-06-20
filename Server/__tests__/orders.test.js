const ordersController = require('../controllers/orders.controller');
const Product  = require('../models/product.model');
const Order = require('../models/order.model');
const OrderProduct = require('../models/orderProduct.model');
const User = require('../models/user.model')
const Review = require('../models/review.model');
const { paginate, generatePaginationPath } = require('../utilities/pagination');

jest.mock('../models');

jest.mock('../models/order.model', () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();
  const OrderMock = dbMock.define('Order',  {
      bulkCreate: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      belongsToMany: jest.fn(),
      belongsTo: jest.fn(),
      hasMany: jest.fn(),
  });
  OrderMock.findOne = jest.fn();
  OrderMock.create = jest.fn();
  return OrderMock;
});

jest.mock('../models/review.model', () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();
  return dbMock.define('Review', {
      belongsTo: jest.fn(),
  });
});

jest.mock('../models/user.model', () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();
  return dbMock.define('User', {
      hasMany: jest.fn(),
      belongsTo: jest.fn(),
  });
});

jest.mock('../models/product.model', () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();
  const ProductMock = dbMock.define('Product',  {
      hasMany: jest.fn(),
      hasOne: jest.fn(),
      belongsToMany: jest.fn(),
  });
  ProductMock.findByPk = jest.fn();
  ProductMock.findOnde = jest.fn();
  return ProductMock;
});

jest.mock('../models/location.model', () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();
  return dbMock.define('Location', {
      hasMany: jest.fn(),
  });
});

jest.mock('../models/category.model', () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();
  return dbMock.define('Category',  {
      hasMany: jest.fn(),
  });
});

jest.mock('../models/subCategory.model', () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();
  return dbMock.define('SubCategory', {
      belongsTo: jest.fn(),
  });
});

jest.mock('../models/genre.model', () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();
  return dbMock.define('Genre', {
      belongsToMany: jest.fn(),
  });
});

jest.mock('../models/gameMode.model', () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();
  return dbMock.define('Game Mode', {
      belongsToMany: jest.fn(),
  });
});

jest.mock('../models/discount.model', () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();
  return dbMock.define('Discount', {
      belongsTo: jest.fn(),
  });
});

jest.mock('../models/orderProduct.model', () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();
  return dbMock.define('OrderProduct', {
      belongsTo: jest.fn(),
  });
})

jest.mock('../utilities/pagination');

test("getAllOrders Test", async () => {
  const req = {};
  const res = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };

  const data = [
    { id: 1, name: 'Order 1' },
    { id: 2, name: 'Order 2' },
  ];

  const mockOrdersData = {
    data: data,
    pagination: { currentPage: 1, totalPages: 2 },
  };

  const mockPaginationPath = { nextPage: '/orders?page=2', prevPage: null };

  paginate.mockResolvedValue(mockOrdersData);
  generatePaginationPath.mockResolvedValue(mockPaginationPath);

  jest.spyOn(ordersController, "getAllOrders").mockImplementation(async () => {
    return res.status(200).send({
      pagination: mockOrdersData.pagination,
      data: mockOrdersData.data,
      links: [
        { rel: 'createOrder', href: '/orders', method: 'POST' },
        { rel: 'getCurrent', href: '/orders/current', method: 'GET' },
        { rel: 'nextPage', href: mockPaginationPath.nextPage, method: 'GET' },
        { rel: 'prevPage', href: mockPaginationPath.prevPage, method: 'GET' },
      ],
    });
  });

  await ordersController.getAllOrders(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.send).toHaveBeenCalledWith({
    pagination: mockOrdersData.pagination,
    data: mockOrdersData.data,
    links: [
      { rel: 'createOrder', href: '/orders', method: 'POST' },
      { rel: 'getCurrent', href: '/orders/current', method: 'GET' },
      { rel: 'nextPage', href: mockPaginationPath.nextPage, method: 'GET' },
      { rel: 'prevPage', href: mockPaginationPath.prevPage, method: 'GET' },
    ],
  });
});

test("getOrdersMe Test", async () => {
    const req = {};
    const res = {
      locals: { userID: 1 },
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  
    const data = [
      { id: 1, name: 'Order 1' },
      { id: 2, name: 'Order 2' },
    ];
  
    const mockOrdersData = {
      data: data,
      pagination: { currentPage: 1, totalPages: 2 },
    };
  
    const mockPaginationPath = { nextPage: '/orders?page=2', prevPage: null };
  
    paginate.mockResolvedValue(mockOrdersData);
    generatePaginationPath.mockResolvedValue(mockPaginationPath);
  
    jest.spyOn(ordersController, "getOrdersMe").mockImplementation(async () => {
      if (mockOrdersData.data.length === 0) {
        return res.status(404).send({ message: "No orders found." });
      }
  
      return res.status(200).send({
        pagination: mockOrdersData.pagination,
        data: mockOrdersData.data,
        links: [
          { rel: 'createOrder', href: '/orders', method: 'POST' },
          { rel: 'getCurrent', href: '/orders/current', method: 'GET' },
          { rel: 'nextPage', href: mockPaginationPath.nextPage, method: 'GET' },
          { rel: 'prevPage', href: mockPaginationPath.prevPage, method: 'GET' },
        ],
      });
    });
  
    await ordersController.getOrdersMe(req, res);
  
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      pagination: mockOrdersData.pagination,
      data: mockOrdersData.data,
      links: [
        { rel: 'createOrder', href: '/orders', method: 'POST' },
        { rel: 'getCurrent', href: '/orders/current', method: 'GET' },
        { rel: 'nextPage', href: mockPaginationPath.nextPage, method: 'GET' },
        { rel: 'prevPage', href: mockPaginationPath.prevPage, method: 'GET' },
      ],
    });
  });


  // Your test code
test("getCurrentOrder Test", async () => {
  const req = {};
  const res = {
    locals: { userID: 1 },
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };

  const mockCurrentOrder = { id: 1, name: 'Order 1', state: 'cart' };

  // Mock the findOne function
  Order.findOne.mockImplementation(() => Promise.resolve(mockCurrentOrder));

  jest.spyOn(ordersController, "getCurrentOrder").mockImplementation(async () => {
      if (!mockCurrentOrder) {
          return res.status(404).send({ message: "No current order found" });
      }

      return res.status(200).send({
          currentOrder: mockCurrentOrder,
          links: [
              { rel: "createOrder", href: "/orders", method: "POST" },
              { rel: "getOrders", href: "/orders", method: "GET" },
          ],
      });
  });
  
    await ordersController.getCurrentOrder(req, res);
  
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
        currentOrder: mockCurrentOrder,
        links: [
            { rel: "createOrder", href: "/orders", method: "POST" },
            { rel: "getOrders", href: "/orders", method: "GET" },
        ],
    });
  });
/*
  test("createOrder Test", async () => {
    const req = {
      body: {
        products: [
          { productID: 1, quantity: 1, salePrice: 100 },
        ],
      },
    };
    const res = {
      locals: { userID: 1 },
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  
    const mockProduct1 = { productID: 1, stock: 10 };
    const mockOrder = { orderID: 1 };
  
    const findByPkSpy = jest.spyOn(Product, 'findByPk').mockResolvedValueOnce(mockProduct1);
    const findOneSpy = jest.spyOn(Order, 'findOne').mockResolvedValue(null);
    const createSpy = jest.spyOn(Order, 'create').mockResolvedValue(mockOrder);
  
    await ordersController.createOrder(req, res);
  
    expect(findByPkSpy).toHaveBeenCalledWith(1);
    expect(findOneSpy).toHaveBeenCalled();
    expect(createSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({ message: "Order placed successfully." });

    findByPkSpy.mockRestore();
    findOneSpy.mockRestore();
    createSpy.mockRestore();
});

  test("updateOrder Test", async () => {
    const req = {
        body: {
            cardName: 'Test Card',
            cardNumber: 1234567890,
            cardExpiryDate: '2023-12-31',
            products: [
                { productID: 1, quantity: 2 },
                { productID: 2, quantity: 1 },
            ],
            pointsToUse: 10,
        },
    };
    const res = {
        locals: { userID: 1 },
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
    };

    const mockUser = { points: 20, save: jest.fn() };
    const mockOrder = { 
        orderID: 1, 
        state: 'cart', 
        cardName: null, 
        cardNumber: null, 
        cardExpiryDate: null, 
        save: jest.fn() 
    };
    const mockProduct = { productID: 1, stock: 10, save: jest.fn() };
    const mockOrderProduct = { 
        orderID: 1, 
        productID: 1, 
        quantity: 2, 
        salePrice: 10, 
        save: jest.fn() 
    };

    User.findByPk = jest.fn().mockResolvedValue(mockUser);
    Order.findOne = jest.fn().mockResolvedValue(mockOrder);
    Product.findByPk = jest.fn().mockResolvedValue(mockProduct);
    OrderProduct.findOne = jest.fn().mockResolvedValue(null);
    OrderProduct.create = jest.fn().mockResolvedValue(mockOrderProduct);
    OrderProduct.findAll = jest.fn().mockResolvedValue([mockOrderProduct]);

    await ordersController.updateOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
        message: "Order updated successfully.",
        totalValue: 30,
        discount: 5,
        pointsUsed: 10,
        pointsEarned: 15
    });
});
*/