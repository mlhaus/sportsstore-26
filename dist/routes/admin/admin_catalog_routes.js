"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdminCatalogRoutes = void 0;
const models_1 = require("../../data/orm/models");
const createAdminCatalogRoutes = (router) => {
    router.get("/table", async (req, resp) => {
        const products = await models_1.ProductModel.findAll({
            include: [
                { model: models_1.SupplierModel, as: "supplier" },
                { model: models_1.CategoryModel, as: "category" }
            ],
            raw: true, nest: true
        });
        resp.render("admin/product_table", { products });
    });
    router.delete("/:id", async (req, resp) => {
        const id = req.params.id;
        const count = await models_1.ProductModel.destroy({ where: { id } });
        if (count == 1) {
            resp.end();
        }
        else {
            throw Error(`Unexpected deletion count result: ${count}`);
        }
    });
};
exports.createAdminCatalogRoutes = createAdminCatalogRoutes;
