const { Category, SubCategory } = require('../models');
const categoriesController = require('../controllers/categories.controller');
const { generatePaginationPath, paginate } = require('../utilities/pagination');

// Mock dependencies
jest.mock('../models');
jest.mock('../utilities/pagination');

jest.mock('../models/category.model', () => {
    const SequelizeMock = require('sequelize-mock');
    const dbMock = new SequelizeMock();
    return dbMock.define('Category',  {
        hasMany: jest.fn(),
        hasOne: jest.fn(),
    });
});

describe('Categories Controller', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('findAllCategory - success', async () => {
        const req = { query: { title: 'example' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        const categoriesData = {
            pagination: { currentPage: 1, totalPages: 1 },
            data: [{ categoryID: 1, categoryName: 'Test Category' }]
        };

        paginate.mockResolvedValue(categoriesData);
        generatePaginationPath.mockResolvedValueOnce('/next').mockResolvedValueOnce('/prev');

        await categoriesController.findAllCategory(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({
            pagination: categoriesData.pagination,
            data: categoriesData.data,
            links: [
                { rel: "createCategories", href: "/categories", method: "POST" },
                { rel: "deleteCategories", href: "/categories/:categoryID", method: "DELETE" },
                { rel: "nextPage", href: '/next', method: "GET" },
                { rel: "prevPage", href: '/prev', method: "GET" }
            ]
        });
    });

    test('createCategory - success', async () => {
        const req = { body: { categoryName: 'New Category' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        Category.findOne.mockResolvedValue(null);
        Category.create.mockResolvedValue({ categoryName: 'New Category' });

        await categoriesController.createCategory(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith({ message: "New Category created with success." });
    });

    test('deleteCategory - success', async () => {
        const req = { params: { categoryID: '1' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        Category.destroy.mockResolvedValue(1);

        await categoriesController.deleteCategory(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith({ message: "Category deleted successfully." });
    });

    test('getSubCategories - success', async () => {
        const req = { params: { categoryID: '1' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        const subCategoriesData = {
            pagination: { currentPage: 1, totalPages: 1 },
            data: [{ subCategoryID: 1, subCategoryName: 'Test SubCategory' }]
        };

        paginate.mockResolvedValue(subCategoriesData);
        generatePaginationPath.mockResolvedValueOnce('/next').mockResolvedValueOnce('/prev');

        res.locals = { categoryID: req.params.categoryID };

        await categoriesController.getSubCategories(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({
            pagination: subCategoriesData.pagination,
            data: subCategoriesData.data,
            links: [
                { rel: "addSubCategories", href: "/subCategories", method: "POST" },
                { rel: "deleteSubCategories", href: "/subCategories/:subCategoryID", method: "DELETE" },
                { rel: "nextPage", href: "undefined", method: "GET" },
                { rel: "prevPage", href: '/prev', method: "GET" }
            ]
        });
    });

    test('delSubCategory - success', async () => {
      const req = { params: { subCategoryID: '1' } };
      const res = {
          status: jest.fn().mockReturnThis(),
          send: jest.fn(),
          locals: {}
      };

      const subCategory = { subCategoryID: '1' };
      res.locals.subCategory = subCategory;

      SubCategory.destroy.mockResolvedValue(1);

      await categoriesController.delSubCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalledWith({ message: "SubCategory deleted successfully." });
  });
});
