import product from "../models/product.mjs";

export const getAllProductsStatic = async (req, res) => {
  const { featured, company, name, sort, fields, limit, page, numericFilters } =
    req.query;
  const queryObject = {};
  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }

  if (name) {
    queryObject.name = {
      $regex: name,
      $options: "i",
    };
  }

  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    console.log(filters);
    const options = ["price", "rating"];
    filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }
  console.log(queryObject);
  let result = product.find(queryObject);
  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("createdAt");
  }

  if (fields) {
    const fieldsList = fields.split(",").join(" ");
    result = result.select(fieldsList);
  }

  const pageNo = page || 1;
  const maxItems = limit || 10;

  const skip = (pageNo - 1) * maxItems;

  result = result.skip(skip).limit(maxItems);

  try {
    const allProducts = await result;
    return res.status(200).json({ allProducts, nbHits: allProducts.length });
  } catch (err) {
    return res.status(500).json({
      msg: "Couldn't find any products",
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const allProducts = await product.find({});
    return res.status(200).json({ allProducts });
  } catch (err) {
    return res.status(500).json({
      msg: "Couldn't find any products",
    });
  }
};
