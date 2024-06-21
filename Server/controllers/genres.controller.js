const Genre = require('../models/genre.model');
const { handleServerError, handleBadRequest, handleConflictError, handleNotFoundError } = require('../utilities/errors');
const { paginate, generatePaginationPath } = require("../utilities/pagination")

module.exports = {
    findAllGenre: async (req, res) => {
        try {
            // Construct links for pagination
            let nextPage, prevPage = await generatePaginationPath(req, res,) //Generates the Url dinamically for the nextPage and previousPage
            const genres = await paginate(Genre, {attributes: ['genreID', 'genreName']})
            const links = [
                { rel: "createGenre", href: "/genre", method: "POST" },
                { rel: "deleteGenre", href: "/genre/:genreID", method: "DELETE" },
                { rel: "nextPage", href: nextPage, method: "GET" },
                { rel: "prevPage", href: prevPage, method: "GET" }
            ];
            return res.status(200).send(
                {
                    pagination: genres.pagination,
                    data: genres.data,
                    links: links
                }
            );
        } catch (error) {
            handleServerError(error, res)
        }
    },
    createGenre: async (req, res) => {
        try {
            // Verify if the genreName is empty
            if (!req.body.genreName) {
                handleBadRequest(res, "Genre Name can not be empty");
            }
            if (req.body.genreName) {
                const existingGenre = await Genre.findOne({ where: { genreName: req.body.genreName } });
                if (existingGenre) {
                    handleConflictError(res, "A genre with that name already exists")
                }
            }
            const regex = /^[A-Za-z\s]+$/;
            if (!regex.test(req.body.genreName)) {
                return res.status(400).send({
                    message: "GenreName must be a string"
                });
            }
            // Saves the database in the database
            await Genre.create({
                genreName: req.body.genreName,
            });
            return res.status(201).send({
                message: "New genre created with success."
            });
        } catch (error) {
            handleServerError(error, res)
        }
    },
    deleteGenre: async (req, res) => {
        try {
            let result = await Genre.destroy({ where: { genreID: req.params.genreID } })
            if (result == 1)
                return res.status(201).send({
                    message: `Genre deleted successfully.`
                });
            else {
                handleNotFoundError(res, "Genre Not Found")
            }
        }
        catch (error) {
            handleServerError(error, res)
        }
    }
}