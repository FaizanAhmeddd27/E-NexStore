import { useState } from 'react'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { createProduct } from '../../redux/thunks/productThunks'
import { Upload, X, ImagePlus } from 'lucide-react'
import { useDropzone } from 'react-dropzone'

const CreateProduct = () => {
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.products)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'jeans',
    stock: '',
  })

  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0]
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!imageFile) {
      alert('Please select an image')
      return
    }

    const data = new FormData()
    data.append('name', formData.name)
    data.append('description', formData.description)
    data.append('price', formData.price)
    data.append('category', formData.category)
    data.append('stock', formData.stock)
    data.append('image', imageFile)

    await dispatch(createProduct(data))

    // Reset form
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'jeans',
      stock: '',
    })
    setImageFile(null)
    setImagePreview(null)
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Product</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Product Image
          </label>
          
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X size={20} />
              </motion.button>
            </div>
          ) : (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'
              }`}
            >
              <input {...getInputProps()} />
              <ImagePlus className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-600 mb-2">
                {isDragActive ? 'Drop the image here' : 'Drag & drop an image here'}
              </p>
              <p className="text-sm text-gray-500">or click to browse</p>
            </div>
          )}
        </div>

        {/* Product Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Product Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="e.g., Classic Blue Jeans"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            className="input-field resize-none"
            placeholder="Describe your product..."
          />
        </div>

        {/* Price & Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Price ($)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="input-field"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Stock
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              min="0"
              className="input-field"
              placeholder="0"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="input-field"
          >
            <option value="jeans">Jeans</option>
            <option value="t-shirts">T-Shirts</option>
            <option value="shoes">Shoes</option>
            <option value="jackets">Jackets</option>
            <option value="bags">Bags</option>
            <option value="accessories">Accessories</option>
            <option value="hoodies">Hoodies</option>
            <option value="shirts">Shirts</option>
            <option value="pants">Pants</option>
            <option value="shorts">Shorts</option>
            <option value="caps">Caps</option>
            <option value="watches">Watches</option>
            
          </select>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full btn-primary py-4 text-lg"
        >
          {loading ? (
            <div className="spinner spinner-sm"></div>
          ) : (
            <>
              <Upload size={20} />
              Create Product
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  )
}

export default CreateProduct