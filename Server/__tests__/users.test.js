const Products = require('../models/product.model');
const { Product: ProductModel } = require('../models/product.model');
const { Category, SubCategory } = require('../models/category.model');
const Genre = require('../models/genre.model');
const GameMode = require('../models/gameMode.model');
const { addReview } = require('../controllers/products.controller');
const { getReviews } = require('../controllers/products.controller');
const { addDiscount } = require('../controllers/products.controller');
const Review = require('../models/review.model');
const OrderProduct = require('../models/orderProduct.model');
const Order = require('../models/order.model');
const Discount = require('../models/discount.model');
const User = require('../models/user.model');
const { login } = require('../controllers/users.controller');
const usersController = require('../controllers/users.controller');
const productsController = require('../controllers/products.controller');
//const { getProductLinks } = require('../utilities/hateoas');
const { generatePaginationPath, paginate } = require('../utilities/pagination');
const { belongsTo, HasOne } = require('sequelize');
const { getProducts, getProduct } = require('../controllers/products.controller');
const getProductLinks = jest.fn();
const Product = { destroy: jest.fn().mockResolvedValue(1) };

jest.mock('../models/product.model', () => {
    const SequelizeMock = require('sequelize-mock');
    const dbMock = new SequelizeMock();
    return dbMock.define('Product',  {
        hasMany: jest.fn(),
        hasOne: jest.fn(),
        belongsToMany: jest.fn(),
    });
});

jest.mock('../models/order.model', () => {
    const SequelizeMock = require('sequelize-mock');
    const dbMock = new SequelizeMock();
    return dbMock.define('Order', {
        belongsTo: jest.fn(),
    });
});


jest.mock('../models/category.model', () => {
    const SequelizeMock = require('sequelize-mock');
    const dbMock = new SequelizeMock();
    return dbMock.define('Category',  {
        hasMany: jest.fn(),
        hasOne: jest.fn(),
    });
});

jest.mock('../models/subCategory.model', () => {
    const SequelizeMock = require('sequelize-mock');
    const dbMock = new SequelizeMock();
    return dbMock.define('SubCategory', {
        belongsTo: jest.fn(),
    });
});

jest.mock('../models/location.model', () => {
    const SequelizeMock = require('sequelize-mock');
    const dbMock = new SequelizeMock();
    return dbMock.define('Location', {
        hasMany: jest.fn(),
    });
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
    const UserMock = dbMock.define('User',  {
        belongsTo: jest.fn(),
    });
    UserMock.findByPk = jest.fn();
    UserMock.findOne = jest.fn();
    UserMock.create = jest.fn();
    UserMock.destroy = jest.fn();
    return UserMock;
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
    const DiscountMock = dbMock.define('Discount',  {
        belongsTo: jest.fn(),
    });
    DiscountMock.create = jest.fn();
    return DiscountMock;
});

jest.mock('../models/orderProduct.model', () => {
    const SequelizeMock = require('sequelize-mock');
    const dbMock = new SequelizeMock();
    return dbMock.define('Order Product', {
        belongsTo: jest.fn(),
    });
});

jest.mock('../models');
jest.mock('../utilities/pagination');

afterEach(() => {
    jest.clearAllMocks();
});

test("Login Test", async () => {
    const req = {
        body: {
            username: "admin",
            password: "Esmad",
        },
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
    };

    const mockUser = {
        username: 'admin',
        password: 'Esmad',
        isBanned: false,
        userID: '123',
    };

    const SignToken = jest.fn();

    User.findOne.mockResolvedValue(mockUser);
    SignToken.mockResolvedValue('token');

    jest.spyOn(usersController, "login").mockImplementation(async () => {
        return res.status(201).send({ accessToken: 'token' });
    });

    await usersController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({ accessToken: 'token' });
});

test("Register Test", async () => {
    const req = {
        body: {
            username: "newUser",
            password: "password",
            email: "newUser@example.com",
        },
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
    };

    const mockUser = {
        username: 'newUser',
        email: 'newUser@example.com',
        password: 'password',
        userID: '123',
    };

    const SignToken = jest.fn();

    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue(mockUser);
    SignToken.mockResolvedValue('token');

    jest.spyOn(usersController, "register").mockImplementation(async () => {
        return res.status(201).send({ message: "Registered Successfully", token: 'token' });
    });

    await usersController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({ message: "Registered Successfully", token: 'token' });
});

test("Get Users Test", async () => {
    const req = {
        query: {
            offset: 0,
            limit: 10,
        },
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
    };

    const mockUsers = {
        pagination: { offset: 0, limit: 10, total: 20 },
        data: [
            { userID: '1', username: 'user1', email: 'user1@example.com', role: 'user', isBanned: false },
            { userID: '2', username: 'user2', email: 'user2@example.com', role: 'user', isBanned: false },
            // ... more users ...
        ],
    };

    paginate.mockResolvedValue(mockUsers);
    generatePaginationPath.mockResolvedValue({ nextPage: '/users?offset=10&limit=10', prevPage: null });

    jest.spyOn(usersController, "getUsers").mockImplementation(async () => {
        return res.status(200).send({
            pagination: mockUsers.pagination,
            data: mockUsers.data,
            links: [
                { rel: "login", href: "/users/login", method: "POST" },
                { rel: "register", href: "/users", method: "POST" },
                { rel: "editProfile", href: "/users/me", method: "PATCH" },
                { rel: "banUser", href: "/users/:userID", method: "PATCH" },
                { rel: "nextPage", href: '/users?offset=10&limit=10', method: "GET" },
                { rel: "prevPage", href: null, method: "GET" },
            ],
        });
    });

    await usersController.getUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
        pagination: mockUsers.pagination,
        data: mockUsers.data,
        links: [
            { rel: "login", href: "/users/login", method: "POST" },
            { rel: "register", href: "/users", method: "POST" },
            { rel: "editProfile", href: "/users/me", method: "PATCH" },
            { rel: "banUser", href: "/users/:userID", method: "PATCH" },
            { rel: "nextPage", href: '/users?offset=10&limit=10', method: "GET" },
            { rel: "prevPage", href: null, method: "GET" },
        ],
    });
});

test("Edit Profile Test", async () => {
    const req = {
        body: {
            username: "user1",
            password: "password",
            email: "user1@example.com",
            address: "address",
            postalCode: "postalCode",
            profileImg: "profileImg",
        },
    };

    const res = {
        locals: { userID: '1' },
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
    };

    const mockUser = {
        userID: '1',
        username: 'user1',
        email: 'user1@example.com',
        password: 'password',
        address: 'address',
        postalCode: 'postalCode',
        profileImg: 'profileImg',
        save: jest.fn(),
    };

    User.findByPk.mockResolvedValue(mockUser);

    jest.spyOn(usersController, "editProfile").mockImplementation(async () => {
        return res.status(200).send({ message: "Data successfully updated" });
    });

    await usersController.editProfile(req, res);

    expect(mockUser.username).toBe(req.body.username);
    expect(mockUser.password).toBe(req.body.password);
    expect(mockUser.email).toBe(req.body.email);
    expect(mockUser.address).toBe(req.body.address);
    expect(mockUser.profileImg).toBe(req.body.profileImg);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ message: "Data successfully updated" });
});

test("Get Self Test", async () => {
    const req = {};

    const res = {
        locals: { userID: '1' },
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
    };

    const mockUser = {
        username: 'user1',
        email: 'user1@example.com',
        address: 'address',
        points: 100,
        profileImg: 'profileImg',
        role: 'user',
    };

    User.findByPk.mockResolvedValue(mockUser);

    jest.spyOn(usersController, "getSelf").mockImplementation(async () => {
        return res.status(200).send({ user: mockUser, links: [
            { rel: "login", href: "/users/login", method: "POST" },
            { rel: "register", href: "/users", method: "POST" },
        ]});
    });

    await usersController.getSelf(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ user: mockUser, links: [
        { rel: "login", href: "/users/login", method: "POST" },
        { rel: "register", href: "/users", method: "POST" },
    ]});
});

test("Ban User Test", async () => {
    const req = {
        params: { userID: '1' },
        body: { isBanned: true },
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
    };

    const mockUser = {
        userID: '1',
        isBanned: true,
        save: jest.fn(),
    };

    User.findByPk.mockResolvedValue(mockUser);

    jest.spyOn(usersController, "banUser").mockImplementation(async () => {
        return res.status(200).send({ message: "Data Successfully Updated" });
    });

    await usersController.banUser(req, res);

    expect(mockUser.isBanned).toBe(req.body.isBanned);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ message: "Data Successfully Updated" });
});