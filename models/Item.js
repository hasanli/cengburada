import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: { type: String, default: '' },
  rating: { type: Number, default: 0 }
}, { _id: false });

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  seller: { type: String, default: '' },
  image: { type: String, default: '' },

  category: {
    type: String,
    enum: ['Not Specified', 'Vinyls', 'AntiqueFurniture', 'GPSSportWatches', 'RunningShoes'],
    default: 'Not Specified'
  },

  // batteryLife, age, size, material
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },

  ratings: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: { type: Number, default: 0 }
    }
  ],

  reviews: [ReviewSchema],

  averageRating: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.Item || mongoose.model('Item', ItemSchema);
