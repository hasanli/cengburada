import { connectToDB } from '../../lib/mongodb';
import Item from '../../models/Item';
import User from '../../models/User';

export default async function handler(req, res) {
  await connectToDB();

  switch (req.method) {
    case 'POST':
      try {
        const newItem = new Item({ ...req.body });
        await newItem.save();
        return res.status(201).json({ message: "Item created", item: newItem });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

    case 'DELETE':
      try {
        const { itemId } = req.body;
        await Item.findByIdAndDelete(itemId);
        return res.status(200).json({ message: "Item removed" });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

    case 'PUT':
      try {
        const { action, itemId, userId, rating, reviewText } = req.body;
        const item = await Item.findById(itemId);
        if (!item) return res.status(404).json({ message: "Item not found" });

        if (action === 'update') {
          const { name, description, price, seller, image, category, batteryLife, age, size, material } = req.body;
          const updated = await Item.findByIdAndUpdate(itemId, {
            name, description, price, seller, image, category, batteryLife, age, size, material
          }, { new: true });
          return res.status(200).json({ message: "Item updated", item: updated });
        }

        if (action === 'feedback') {
          let reviewExists = item.reviews.find(r => {
            const uid = typeof r.userId === 'object' ? r.userId.toString() : r.userId;
            return uid === userId;
          });

          if (rating !== null && rating !== undefined && reviewText) {
            if (reviewExists) {
              reviewExists.rating = rating;
              reviewExists.text = reviewText;
            } else {
              item.reviews.push({ userId, rating, text: reviewText });
            }
          } else if (rating !== null && rating !== undefined) {
            if (reviewExists) {
              reviewExists.rating = rating;
            } else {
              item.reviews.push({ userId, rating });
            }
          } else if (reviewText) {
            if (reviewExists) {
              reviewExists.text = reviewText;
            } else {
              item.reviews.push({ userId, text: reviewText });
            }
          }

          const validRatings = item.reviews.filter(r => typeof r.rating === 'number');
          const avg = validRatings.reduce((sum, r) => sum + r.rating, 0) / (validRatings.length || 1);
          item.averageRating = avg;

          await item.save();

          const user = await User.findById(userId);
          if (user) {
            const allItems = await Item.find({ 'reviews.userId': userId });
            let total = 0, count = 0;
            allItems.forEach(i => {
              i.reviews.forEach(r => {
                if (r.userId.toString() === userId && typeof r.rating === 'number') {
                  total += r.rating;
                  count += 1;
                }
              });
            });
            user.averageRatingGiven = count > 0 ? total / count : 0;
            await user.save();
          }

          const updatedPopulatedItem = await Item.findById(item._id).populate({
            path: 'reviews.userId',
            select: 'username'
          });

          return res.status(200).json({ message: "Item updated", item: updatedPopulatedItem });
        }

        return res.status(400).json({ message: "Invalid action" });
      } catch (error) {
        console.error("PUT error:", error);
        return res.status(500).json({ error: error.message });
      }

    default:
      try {
        const items = await Item.find({}).populate({
          path: 'reviews.userId',
          select: 'username'
        });
        return res.status(200).json(items);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
  }
}
