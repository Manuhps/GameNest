const gameModeController = require('../controllers/gameMode.controller');
const gameMode = require('../models/gameMode.model');

jest.spyOn(gameMode, 'destroy').mockImplementation(() => Promise.resolve(1));

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
  
    jest.spyOn(gameModeController, "findAllGameMode").mockImplementation(async () => {
      return res.status(200).json({ success: true, gameMode: data });
    });
  
    await gameModeController.findAllGameMode(req, res);
  
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, gameMode: data });
  });


  test("Create gameMode Test", async () => {
    const req = {
      body: {
        gameModeName: "new game Mode",
      },
    };
  
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  
    jest.spyOn(gameModeController, "createGameMode").mockImplementation(async () => {
      return res.status(201).send({ message: "New GameMode created with success." });
    });
  
    await gameModeController.createGameMode(req, res);
  
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({ message: "New GameMode created with success." });
  });
  
  
  test("Delete gameMode Test", async () => {
    const req = {
      params: {
        gameModeID: "exampleID",
      },
    };
  
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  
    gameMode.destroy.mockResolvedValue(1);
  
    await gameModeController.deleteGameMode(req, res);
  
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({ message: "Game Mode deleted successfully." });
  });
  
  test("Delete gameMode Test", async () => {
    const req = {
      params: {
        gameModeID: "exampleID",
      },
    };
  
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  
    gameMode.destroy.mockResolvedValue(1);
  
    await gameModeController.deleteGameMode(req, res);
  
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({ message: "Game Mode deleted successfully." });
  });

  test("Delete GameMode Test - Game Mode not found", async () => {
    const req = {
      params: {
        gameModeID: "invalidID",
      },
    };
  
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  
    // Simular que o gênero não foi encontrado
    gameMode.destroy.mockResolvedValue(0);
  
    await gameModeController.deleteGameMode(req, res);
  
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({ message: "Game Mode not found" });
});

test("Delete GameMode Test - Server error", async () => {
    const req = {
      params: {
        gameModeID: "errorID",
      },
    };
  
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  
    // Simular um erro no servidor
    gameMode.destroy.mockRejectedValue(new Error('Server error'));
  
    await gameModeController.deleteGameMode(req, res);
  
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalled();
});
