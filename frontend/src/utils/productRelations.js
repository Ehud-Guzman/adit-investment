const productRelations = {
  monitors: ["accessories", "computers"],
  printers: ["toners", "accessories"],
  laptops: ["accessories", "computers"],
  computers: ["accessories", "monitors"],
  toners: ["printers"],
  accessories: ["monitors", "laptops", "computers", "phones" , "CCTV"],
};

export default productRelations;
