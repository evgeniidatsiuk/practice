import mongoose, { Schema } from 'mongoose'
import mongooseKeywords from 'mongoose-keywords'

const productSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  pictures: {
    type: Array
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: Schema.ObjectId,
    ref: 'Category',
    index: true,
    required: true
  },
  total: {
    type: Number,
    min: 1,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

productSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      name: this.name,
      pictures: this.pictures,
      description: this.description,
      category: this.category,
      total: this.total,
      price: this.price,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

productSchema.plugin(mongooseKeywords, { paths: ['name', 'description'] })

const model = mongoose.model('Product', productSchema)

export const schema = model.schema
export default model
