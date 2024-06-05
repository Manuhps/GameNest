module.exports = {
    generatePaginationPath: async (req, res) => {
        const offset = req.query.offset ? parseInt(req.query.offset) : 0;
        const limit = req.query.limit ? parseInt(req.query.limit) : 0;

        const baseUrl= req.baseUrl
    
        // Construct links for pagination
        const nextPage = `${baseUrl}?offset=${offset + offset}&limit=${limit}`;
        const prevPage = offset > 0 ? `${baseUrl}?offset=${offset - offset}&limit=${limit}` : null;
        
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