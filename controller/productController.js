const Product = require("../models/productModel");
const asyncHandler = require('express-async-handler');
const slugify = require("slugify");
const { copy } = require("../routers/productRoute");

const getAllProducts = asyncHandler(async (req, res) => {
    try {
        //Filtering
        const queryObj = {...req.query};

        const excludeFields = ["page", "sort", "limit", "fields"];
        excludeFields.forEach((field) => delete queryObj[field]);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        
        let query = Product.find(JSON.parse(queryStr));

        //Sorting
        if(req.query.sort) {
            const sortBy = req.query.sort.split(',').join(" ");
            query = query.sort(sortBy)
        } else {
            query = query.sort("-createdAt")
        }

        //Limiting
        if(req.query.fields) {
            const fields = req.query.fields.split(',').join(" ");
            query = query.select(fields);
        } else {
            query = query.select("-__v");
        }

        //Pagination
        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        if(req.query.page) {
            const productCount = await Product.countDocuments();
            if(skip >= productCount) {
                throw new Error("the page does not exist");
            }
        }

        //Get data
        const products = await query;
        res.json(products);
    } catch(error) {
        throw new Error(error)
    }
});

const createProduct = asyncHandler(async (req, res) => {
    try {
        if(req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const product = await Product.create(req.body);
        res.json(product);
    } catch(error) {
        throw new Error(error)
    }
});

const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        if(req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const product = await Product.findByIdAndUpdate(id,req.body,{new: true });
        res.json(product);
    } catch(error) {
        throw new Error(error)
    }
});

const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByIdAndDelete(id);
        console.log(product);
        res.json(product);
    } catch(error) {
        throw new Error(error)
    }
});

const getProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        res.json(product);
    } catch(error) {
        throw new Error(error)
    }
});

module.exports = { 
    createProduct,
    getProduct,
    getAllProducts,
    updateProduct,
    deleteProduct
};