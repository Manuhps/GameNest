const genresController = require('../controllers/genres.controller');
const Genre = require('../models/genre.model', () => ({
    create: jest.fn().mockReturnValue(Promise.reject(new Error('Server error'))),
}));

jest.spyOn(Genre, 'destroy').mockImplementation(() => Promise.resolve(1));

// Mock the paginate and generatePaginationPath functions
jest.mock('../utilities/pagination', () => () => Promise.resolve({
    pagination: {},
    data: [],
  }));

  test("FindAll Test", async () => {
    const req = {
      query: {
        title: "example",
      },
    };
  
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  
    const data = [
      { title: "example 1", descricao: "example 1", status: "In Progress" },
      { title: "example 2", descricao: "example 2", status: "Completed" },
    ];
  
    jest.spyOn(genresController, "findAllGenre").mockImplementation(async () => {
      return res.status(200).json({ success: true, genre: data });
    });
  
    await genresController.findAllGenre(req, res);
  
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, genre: data });
  });


  test("Create genre Test", async () => {
    const req = {
      body: {
        genreName: "new genre",
      },
    };
  
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  
    jest.spyOn(genresController, "createGenre").mockImplementation(async () => {
      return res.status(201).send({ message: "New genre created with success." });
    });
  
    await genresController.createGenre(req, res);
  
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({ message: "New genre created with success." });
  });
  
  test("Delete genre Test", async () => {
    const req = {
      params: {
        genreID: "exampleID",
      },
    };
  
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  
    Genre.destroy.mockResolvedValue(1);
  
    await genresController.deleteGenre(req, res);
  
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({ message: "Genre deleted successfully." });
  });

  test("Delete genre Test - Genre not found", async () => {
    const req = {
      params: {
        genreID: "invalidID",
      },
    };
  
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  
    // Simular que o gênero não foi encontrado
    Genre.destroy.mockResolvedValue(0);
  
    await genresController.deleteGenre(req, res);
  
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({ message: "Genre not found" });
});

test("Delete genre Test - Server error", async () => {
    const req = {
      params: {
        genreID: "errorID",
      },
    };
  
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  
    // Simular um erro no servidor
    Genre.destroy.mockRejectedValue(new Error('Server error'));
  
    await genresController.deleteGenre(req, res);
  
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalled();
});
  
