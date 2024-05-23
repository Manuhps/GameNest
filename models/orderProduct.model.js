const { DataTypes } = require('sequelize');
const sequelize = require('../connection')

const orderProduct = sequelize.define("orderProduct",
{
    orderID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Order', // 'Orders' would also work
            key: 'orderID'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}
);

orderProduct.associate = function(models) {
orderProduct.belongsTo(models.Order, {
    foreignKey: 'orderID',
    as: 'order'
});
};

module.exports = orderProduct;