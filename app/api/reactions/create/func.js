const errors = require('@/errors')
const app = require('@/app')

module.exports = async function(context){
  const Reaction = app.models.reactions
  const Comment = app.models.comments

  const { commentId } = context.params
  const { user } = context

  app.helpers.validate.throwMissingParameter(['commentId'], context.params)
  app.helpers.validate.throwMissingParameter(['kind'], context.body)

  let comment = await Comment.findOne({ _id: String(commentId), active: true }).lean(true)
  if(!comment) throw new errors.BadRequest(`Comentário inválido: ${commentId}`)

  return await Reaction.create({
    kind: context.body.kind,
    comment: comment,
    user: user
  })
}