import { Router } from "express";
import { CategoryModel, ProductModel, SupplierModel }
    from "../../data/orm/models";

export const createAdminCatalogRoutes = (router: Router) => {
    router.get("/table", async (req, resp) => {
        const products = await ProductModel.findAll({
            include: [
                {model: SupplierModel, as: "supplier" },
                {model: CategoryModel, as: "category" }],
            raw: true, nest: true
        });
        resp.render("admin/product_table", { products });
    });
}
