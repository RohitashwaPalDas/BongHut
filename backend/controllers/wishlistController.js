import userModel from "../models/userModel.js";

const addToWishlist = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    let wishListData = user.wishListData.map(id => id.toString());

    let updatedUser;
    if (wishListData.includes(itemId)) {
      updatedUser = await userModel.findByIdAndUpdate(
        userId,
        { $pull: { wishListData: itemId } },
        { new: true }
      );
      return res.json({ success: true, message: "Item removed from wishlist", user: updatedUser });
    } else {
      updatedUser = await userModel.findByIdAndUpdate(
        userId,
        { $addToSet: { wishListData: itemId } },
        { new: true }
      );
      return res.json({ success: true, message: "Item added to wishlist", user: updatedUser });
    }
  } catch (error) {
    console.error("Error toggling wishlist:", error);
    res.json({ success: false, message: "Internal server error" });
  }
};

const getWishlist = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await userModel.findById(userId).populate('wishListData');
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const wishListData = user.wishListData;

    res.json({ success: true, wishListData });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.json({ success: false, message: "Internal server error" });
  }
};


const removeFromWishlist = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    let wishListData = user.wishListData.map(id => id.toString());

    let updatedUser;
    if (wishListData.includes(itemId)) {
      updatedUser = await userModel.findByIdAndUpdate(
        userId,
        { $pull: { wishListData: itemId } },
        { new: true }
      );
      return res.json({ success: true, message: "Item removed from wishlist", user: updatedUser });
    } else{
      return res.json({ success: false, message: "Item not found in wishlist" });
    } 
  } catch (error) {
    console.error("Error removing item from wishlist:", error);
    res.json({ success: false, message: "Internal server error" });
  }
}

export { addToWishlist, getWishlist, removeFromWishlist };