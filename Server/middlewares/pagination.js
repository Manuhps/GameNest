module.exports = {
    generatePaginationPath: async (req, res) => {
        const offset = req.query.offset ? parseInt(req.query.offset) : 0;
        const limit = req.query.limit ? parseInt(req.query.limit) : 0;

        const baseUrl= req.baseUrl
    
        // Construct links for pagination
        const nextPage = `${baseUrl}?offset=${offset + offset}&limit=${limit}`;
        const prevPage = offset > 0 ? `${baseUrl}?offset=${offset - offset}&limit=${limit}` : null;
        
        return nextPage, prevPage
    }
}