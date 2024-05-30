module.exports = {
    generatePaginationPath: async (req, res) => {
        const page = req.query.page ? parseInt(req.query.page) : 0;

        const baseUrl= req.baseUrl
    
        // Construct links for pagination
        const nextPage = `${baseUrl}?page=${page + 1}`;
        const prevPage = page > 0 ? `${baseUrl}?page=${page - 1}` : null;
        
        return nextPage, prevPage
    }

}