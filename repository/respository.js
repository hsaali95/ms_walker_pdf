exports.get = (model, query, isSingle, select, sort) => {
  let find = isSingle ? model.findOne(query) : model.find(query);

  return find.select(select);
};
