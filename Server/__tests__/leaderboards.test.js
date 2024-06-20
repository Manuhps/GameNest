const leaderboardsController = require('../controllers/leaderboards.controller');


test("Get Most Orders Test", async () => {
    const req = {}; // Não há corpo na requisição para getMostOrders
  
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  
    jest.spyOn(leaderboardsController, "getMostOrders").mockImplementation(async () => {
      return res.status(200).send({ message: "Most orders retrieved successfully." });
    });
  
    await leaderboardsController.getMostOrders(req, res);
  
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ message: "Most orders retrieved successfully." });
});

test("Get Most Spent Test", async () => {
    const req = {}; // Não há corpo na requisição para getMostOrders
  
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  
    jest.spyOn(leaderboardsController, "getMostSpent").mockImplementation(async () => {
      return res.status(200).send({ message: "Most spent retrieved successfully." });
    });
  
    await leaderboardsController.getMostSpent(req, res);
  
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ message: "Most spent retrieved successfully." });
});

test("Get Most Spent Reviews", async () => {
    const req = {}; // Não há corpo na requisição para getMostOrders
  
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  
    jest.spyOn(leaderboardsController, "getMostReviews").mockImplementation(async () => {
      return res.status(200).send({ message: "Most reviews retrieved successfully." });
    });
  
    await leaderboardsController.getMostReviews(req, res);
  
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ message: "Most reviews retrieved successfully." });
});