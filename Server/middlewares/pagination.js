module.exports = {
    generatePaginationPath: async (req, res) => {
        const page = req.query.page ? parseInt(req.query.page) : 0;

        const baseUrl = req.baseUrl

        // Construct links for pagination
        const nextPage = `${baseUrl}?page=${page + 1}`;
        const prevPage = page > 0 ? `${baseUrl}?page=${page - 1}` : null;

        return nextPage, prevPage
    },
    paginate: async (model, req, options = {}) => {
        const { offset, limit } = req.query;
        console.log(offset, limit);
        let query = {
            where: options.where || {},
            attributes: options.attributes || {},
            order: options.order || []
        }
        console.log(query);
        if (offset && limit) {
            query.offset = parseInt(offset)
            query.limit = parseInt(limit)
        }
        console.log(query);
        if (order) {
            query.order.push(order)
        }
        const results = await model.findAll(query)
        console.log("ahhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
        console.log(results);
        const totalItems = results.count;
        const totalPages = Math.ceil(totalItems / (limit ? parseInt(limit) : totalItems));
        const currentPage = offset ? Math.floor(parseInt(offset) / parseInt(limit)) + 1 : 1;
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