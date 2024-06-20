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
    return dbMock.define('User', {
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


test("getProducts Test", async () => {
    const req = { query: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  
    const data = [
      { productID: 1, name: 'Product 1' },
      { productID: 2, name: 'Product 2' },
    ];
  
    const mockProductsData = {
      data: data,
      pagination: { currentPage: 1, totalPages: 2 },
    };
  
    const mockPaginationPath = { nextPage: '/products?page=2', prevPage: null };
  
    paginate.mockResolvedValue(mockProductsData);
    generatePaginationPath.mockResolvedValue(mockPaginationPath);
  
    jest.spyOn(productsController, "getProducts").mockImplementation(async () => {
      return res.status(200).send({
        pagination: mockProductsData.pagination,
        data: mockProductsData.data,
        links: [
          { rel: 'createProduct', href: '/products', method: 'POST' },
          { rel: 'getCurrent', href: '/products/current', method: 'GET' },
          { rel: 'nextPage', href: mockPaginationPath.nextPage, method: 'GET' },
          { rel: 'prevPage', href: mockPaginationPath.prevPage, method: 'GET' },
        ],
      });
    });
  
    await productsController.getProducts(req, res);
  
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      pagination: mockProductsData.pagination,
      data: mockProductsData.data,
      links: [
        { rel: 'createProduct', href: '/products', method: 'POST' },
        { rel: 'getCurrent', href: '/products/current', method: 'GET' },
        { rel: 'nextPage', href: mockPaginationPath.nextPage, method: 'GET' },
        { rel: 'prevPage', href: mockPaginationPath.prevPage, method: 'GET' },
      ],
    });
  });

  test("getProduct Test", async () => {
    const req = { params: { productID: 1 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  
    const mockProductData = {
      productID: 1,
      name: 'Product 1',
      desc: 'Description',
      basePrice: 100,
      stock: 10,
      rating: 4.5,
      img: 'image.jpg',
      curPrice: 90,
      Discounts: {
        percentage: 10,
        startDate: new Date(),
        endDate: new Date(),
      },
    };
  
    const mockLinks = [
      { rel: 'getAllProducts', href: '/products', method: 'GET' },
      { rel: 'updateProduct', href: '/products/1', method: 'PUT' },
      { rel: 'deleteProduct', href: '/products/1', method: 'DELETE' },
    ];
  
    //Product.findByPk.mockResolvedValue(mockProductData);
    getProductLinks.mockResolvedValue(mockLinks);
  
    jest.spyOn(productsController, "getProduct").mockImplementation(async () => {
      return res.status(200).send({
        product: mockProductData,
        links: mockLinks,
      });
    });
  
    await productsController.getProduct(req, res);
  
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      product: mockProductData,
      links: mockLinks,
    });
  });
  /*
  test("addProduct Test", async () => {
    const req = {
      body: {
        name: 'Product 2',
        desc: 'Description',
        basePrice: 100,
        stock: 10,
        categoryID: 1,
        genres: [1, 2],
        gameModes: [1, 2]
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  
    const mockProduct = {
      addGenre: jest.fn(),
      addGameMode: jest.fn(),
    };
  
    Product.findOne = jest.fn().mockResolvedValue(null);
    Product.create = jest.fn().mockResolvedValue(mockProduct);
    Genre.findAll = jest.fn().mockResolvedValue([]);
    GameMode.findAll = jest.fn().mockResolvedValue([]);
  
    await productsController.addProduct(req, res);
  
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({ message: "New Product Added With Success." });
  });
*/
  test("deleteProduct Test", async () => {
    const req = {};
    const res = {
      locals: {
        product: {
          productID: 1
        }
      },
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  
    Product.destroy = jest.fn().mockResolvedValue(1);
  
    await productsController.deleteProduct(req, res);
  
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalledWith({ message: "Product deleted successfully." });
  });

    test("addReview Test", async () => {
        const req = {
        body: {
            review: 'Review',
            rating: 5,
        },
        params: {
            productID: 1,
        },
        };
        const res = {
        locals: {
            product: {
            productID: 1,
            },
            user: {
            userID: 1,
            },
        },
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        };
    
        Review.create = jest.fn().mockResolvedValue({});
    
        await addReview(req, res);
    
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith({ message: "Review added successfully. Thank you for taking your time to review the product!" });
    });

    test("getReviews Test", async () => {
        const req = {
            params: {
                productID: 1,
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
    
        const mockReviewData = {
            pagination: {},
            data: [],
        };
    
        paginate.mockResolvedValue(mockReviewData);
    
        await getReviews(req, res);
    
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(mockReviewData);
    });
/*
    test("addDiscount Test", async () => {
        const req = {
            params: {
                productID: 1
            },
            body: {
                startDate: '2022-01-01',
                endDate: '2022-12-31',
                percentage: 10
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        
        Discount.create = jest.fn().mockResolvedValue({});
        
        await addDiscount(req, res);
        
        expect(Discount.create).toHaveBeenCalledWith({
            productID: 1,
            startDate: '2022-01-01',
            endDate: '2022-12-31',
            percentage: 10
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith({ message: "New Discount Added With Success" });
    });
*/
    test("deleteDiscount Test", async () => {
        const req = {
            params: {
                productID: 1,
                discountID: 1
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
    
        Discount.destroy = jest.fn().mockResolvedValue(1);
    
        await productsController.deleteDiscount(req, res);
    
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalledWith({ message: "Discount deleted successfully" });
    });
/*
    test("deleteComment Test", async () => {
        const req = {
            params: {
                reviewID: 1
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
    
        const mockReview = { comment: 'Test comment', save: jest.fn() };
        Review.findByPk = jest.fn().mockResolvedValue(mockReview);
    
        await productsController.deleteComment(req, res);
    
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalledWith({ message: "Comment deleted successfully" });
        expect(mockReview.comment).toBeNull();
        expect(mockReview.save).toHaveBeenCalled();
    });
    */