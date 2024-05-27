module.exports = {
    paginatedResults: async (req, res, limit, model) => {
        // Get the page number from the query parameter, default to page 0 if not specified
        const page = req.query.page ? parseInt(req.query.page) : 0;

        // Calculate the offset based on the page number and limit
        const offset = page * limit;

        const resultsList= await model.findAll({
            offset: offset,
            limit: limit
        });
        return resultsList
    },
    generatePaginationPath: async (req, res) => {
        const page = req.query.page ? parseInt(req.query.page) : 0;

        const baseUrl= req.baseUrl
    
        // Construct links for pagination
        const nextPage = `${baseUrl}?page=${page + 1}`;
        const prevPage = page > 0 ? `${baseUrl}?page=${page - 1}` : null;
        
        return nextPage, prevPage
    }

}