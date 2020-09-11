import mongoose, { Schema } from 'mongoose'
import { nextError } from '../../services/response'
import { Product } from '../product'

const orderSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  products: {
    type: [{ id: { type: Schema.ObjectId, ref: 'Product' }, count: { type: Number } }]
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

orderSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      email: this.email,
      phone: this.phone,
      address: this.address,
      description: this.description,
      products: this.products,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

orderSchema.pre('save', async function (next) {
  const productIds = this.products.map(product => product.id)
  const products = await Product.countDocuments({ _id: productIds })

  for (const product of this.products) {
    if (!product.id) {
      return nextError('Product id is required', 'products.id', product.id || '', next)
    }
    if (!product.count) {
      return nextError('Product count is required', 'products.count', product.count, next)
    }

    if (product.count < 1) {
      return nextError('Product count should be > 1', 'products.count', product.count, next)
    }
  }

  if (productIds.length !== products) {
    return nextError('Some product not found', 'products', this.products, next)
  }

  next()
})

const model = mongoose.model('Order', orderSchema)

export const schema = model.schema
export default model
