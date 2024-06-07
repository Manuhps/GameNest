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
    paginate: async (model, options = {}) => {
        let query = {
            where: options.where || {},
            attributes: options.attributes || {},
            order: options.order || [],
            include: options.include || [],
            offset: options.offset ? parseInt(options.offset): undefined,
            limit: options.limit ? parseInt(options.limit): undefined,
        }
        console.log(query)
        const results = await model.findAndCountAll(query)
        const totalItems = results.count
        const totalPages = Math.ceil(totalItems / (query.limit ? parseInt(query.limit) : totalItems))
        const currentPage = query.offset ? Math.floor(parseInt(query.offset) / parseInt(query.limit)) + 1 : 1
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