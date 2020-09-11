import { success, notFound } from '../../services/response/'
import { Category } from '.'
import faker from 'faker'

export const create = ({ bodymen: { body } }, res, next) =>
  Category.create(body)
    .then((category) => category.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Category.find(query, select, cursor)
    .then((categories) => categories.map((category) => category.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Category.findById(params.id)
    .then(notFound(res))
    .then((category) => category ? category.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) =>
  Category.findById(params.id)
    .then(notFound(res))
    .then((category) => category ? Object.assign(category, body).save() : null)
    .then((category) => category ? category.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  Category.findById(params.id)
    .then(notFound(res))
    .then((category) => category ? category.remove() : null)
    .then(success(res, 204))
    .catch(next)

export const seed = async (req, res, next) => {
  try {
    let i = 0
    while (i < 25) {
      await Category.create({
        name: faker.name.findName(),
        description: faker.lorem.paragraphs()
      })
      i++
    }
    return res.status(200).json({ message: 'Done' })
  } catch (e) {
    next(e)
  }
}
