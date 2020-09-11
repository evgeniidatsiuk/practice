import { success, notFound } from '../../services/response/'
import { Product } from '.'
import { Category } from '../category'
import faker from 'faker'

export const create = ({ bodymen: { body } }, res, next) =>
  Product.create(body)
    .then((product) => product.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) => {
  if (query.category) {
    const category = Category.findById(query.category)
    if (!category) {
      return res.status(400).json({
        valid: false,
        message: 'Category not found',
        param: 'category',
        value: query.category
      })
    }
  }
  return Product.count(query)
    .then(count => Product.find(query, select, cursor)
      .then((products) => ({
        count,
        rows: products.map((product) => product.view())
      }))
    )
    .then(success(res))
    .catch(next)
}

export const show = ({ params }, res, next) =>
  Product.findById(params.id)
    .then(notFound(res))
    .then((product) => product ? product.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) =>
  Product.findById(params.id)
    .then(notFound(res))
    .then((product) => product ? Object.assign(product, body).save() : null)
    .then((product) => product ? product.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  Product.findById(params.id)
    .then(notFound(res))
    .then((product) => product ? product.remove() : null)
    .then(success(res, 204))
    .catch(next)

export const seed = async (req, res, next) => {
  try {
    let i = 0
    while (i < 500) {
      await Product.create({
        name: faker.name.findName(),
        description: faker.lorem.paragraphs(),
        pictures: [faker.image.image(), faker.image.image(), faker.image.image(), faker.image.image(), faker.image.image()],
        price: Math.floor(Math.random() * 25000) + 1,
        total: Math.floor(Math.random() * 50) + 1,
        category: (await Category.findOne().skip(Math.floor(Math.random() * 25))).id
      })
      i++
    }
    return res.status(200).json({ message: 'Done' })
  } catch (e) {
    next(e)
  }
}
