/** Совместимость с фронтом, где ожидался Mongo _id */

function withMongoId(instance) {
  if (instance == null) return instance;
  const j = typeof instance.toJSON === 'function' ? instance.toJSON() : { ...instance };
  if (j.id != null) j._id = String(j.id);
  return j;
}

function withMongoIdList(arr) {
  return (arr || []).map(withMongoId);
}

module.exports = { withMongoId, withMongoIdList };
