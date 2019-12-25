const repository = require('../../repository');
const _ = require('lodash');
const async = require('async');

module.exports.create = function (restaurantId, cb) {

    repository.Menu.create({
        restaurantId
    }).then(function (menu) {

        return cb(null, {
            id: menu.id,
            data: menu.data,
            restaurantId: menu.restaurantId,
            items: []
        });

    }, function (err) {
        return (err);
    });

}

module.exports.getById = function (menuId, cb) {

    repository.Menu.findOne({
        where: {
            id: menuId
        }
    }).then(function (menu) {
        if (!(menu && menu.id)) {
            return cb(null, menu);
        }

        repository.Item.findAll({
            where: {
                menuId: menu.id
            }
        }).then(function (items) {
            return cb(null, {
                id: menu.id,
                data: menu.data,
                restaurantId: menu.restaurantId,
                items: items && _.isArray(items) ? items : []
            });
        }, function (err) {
            return cb(err);
        });
    }, function (err) {
        return cb(err);
    });

}

module.exports.getByRestaurantId = function (restaurantId, cb) {
    repository.Menu.findOne({
        where: {
            restaurantId: restaurantId
        }
    }).then(function (menu) {
        if (!(menu && menu.id)) {
            return cb(null, menu);
        }

        repository.Item.findAll({
            where: {
                menuId: menu.id
            }
        }).then(function (items) {
            return cb(null, {
                id: menu.id,
                data: menu.data,
                restaurantId: menu.restaurantId,
                items: items && _.isArray(items) ? items : []
            });
        }, function (err) {
            return cb(err);
        });
    }, function (err) {
        return cb(err);
    });
}

module.exports.getByRestaurantIds = function (restaurantIds, cb) {
    repository.Menu.findAll({
        where: {
            restaurantId: {
                $or: restaurantIds
            }
        }
    }).then(function (menus) {
        if (!(menus && _.isArray(menus) && menus.length > 0)) {
            return cb();
        }

        menus=menus.map(menu => ({
            id: menu.id,
            restaurantId: menu.restaurantId
        }) )

        return repository.Item.findAll({
            where: {
                menuId: {
                    $or: menus.map(menu => menu.id)
                }
            }
        }).then(function (items) {
            const results = [];
            return async.forEachOfSeries(menus, function (menu, idx, icb) {
                results.push({ ...menu, items: items.filter(item => item.menuId == menu.id).map(item => ({name:item.name})) });
                return icb();
            }, function (err) {
                if (err) {
                    return cb(err);
                }

                return cb(null, results);
            })

        }, function (err) {
            return cb(err);
        });
    }, function (err) {
        return cb(err);
    });
}

module.exports.addItem = function (item, cb) {
    repository.Item.create({
        name: item.name,
        category: item.category.toUpperCase().trim(),
        price: _.isNumber(item.price) ? item.price : parseFloat(item.price),
        menuId: item.menuId,
        image: item.image,
        data: item.data
    }).then(function (iitem) {
        module.exports.getById(item.menuId, cb);
    }, function (err) {
        return cb(err);
    })
}

module.exports.update = function (updateParams, cb) {

    repository.Item.update(updateParams.params, {
        where: updateParams.where
    }).then(function(item){
        return module.exports.getById(updateParams.where.menuId, cb);
    });

}

module.exports.delete = function (itemId, cb) {
    repository.Item.findOne({
        where:{id: itemId}
    }).then( function (item) {
        repository.Item.destroy(
            {
                where: {
                    id: itemId
                }
            }).then(function () {

                return module.exports.getById(item.menuId, cb);


            }, function (err) {
                return cb(err, null);

            });
    }, function (err) {
        return cb(err);
    })

}

