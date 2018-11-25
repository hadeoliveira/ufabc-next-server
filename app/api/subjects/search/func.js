const _ = require('lodash')
const app = require('@/app')

module.exports = async function (context) {
  const { q } = context.query

  const regex = new RegExp(escapeRegex(q || ''), 'gi')

  const resp =  await app.models.subjects.aggregate([
    { $match: { search: regex } },
    { $facet:
      {
        total: [ { $count: "total" }],
        data: [
          { $limit: 10 },
        ]
      }
    },
    { $addFields:
      {
        total: { $ifNull: [{ $arrayElemAt: [ "$total.total", 0 ] }, 0] },
      }
    },
    {
      $project: {
        total: 1,
        data: 1,
      }
    }
  ])

  return resp[0]
}

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}