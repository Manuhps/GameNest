module.exports = {
    generatePaginationPath: async (req, res) => {
        const page = req.query.page ? parseInt(req.query.page) : 0;

        const baseUrl = req.baseUrl

        // Construct links for pagination
        const nextPage = `${baseUrl}?page=${page + 1}`;
        const prevPage = page > 0 ? `${baseUrl}?page=${page - 1}` : null;

        return nextPage, prevPage
    },
    paginate: async (model, options = {}) => {
        let query = {
            where: options.where || {},
            attributes: options.attributes || {},
            order: options.order || [],
            offset: options.offset ? parseInt(options.offset): undefined,
            limit: options.limit ? parseInt(options.limit): undefined,
        }
        const results = await model.findAndCountAll(query)
        const totalItems = results.count;
        const totalPages = Math.ceil(totalItems / (query.limit ? parseInt(query.limit) : totalItems));
        const currentPage = query.offset ? Math.floor(parseInt(query.offset) / parseInt(query.limit)) + 1 : 1;
        return {
            pagination: {
                totalItems,
                totalPages,
                currentPage
            },
            data: results.rows
        }
    }
}