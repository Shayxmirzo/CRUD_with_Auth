import { useState } from "react";
import useDelete from "../hooks/useDelete";
import useGet from "../hooks/useGet";
import usePost from "../hooks/usePost";
import usePut from "../hooks/usePut";

const emptyForm = {
  productName: "",
  productImg: "",
  price: "",
  size: "",
  weight: "",
  calories: "",
  discount: "",
  isSpicy: false,
  isPopular: false,
  isVegetarian: false,
  rating: "",
  ingredients: "",
  productDescription: "",
  categoryId: "",
};

function Product() {

  const {
    data: products,
    loading,
    error,
    refresh,
  } = useGet("/products");


  const {
    deleteData,
    loading: deleteLoading,
  } = useDelete("/products");


  const {
    postData,
    loading: postLoading,
  } = usePost("/products");


  const {
    putData,
    loading: putLoading,
  } = usePut("/products");


  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [formData, setFormData] = useState({
    ...emptyForm,
  });

  // ID of the product currently being deleted
  const [deletingId, setDeletingId] = useState(null);


  const handleCreate = () => {
    setIsEditing(false);
    setSelectedProduct(null);

    setFormData({
      ...emptyForm,
    });

    setIsModalOpen(true);
  };



  const handleEdit = (product) => {
    setIsEditing(true);
    setSelectedProduct(product);

    setFormData({
      productName: product.productName || "",
      productImg: product.productImg || "",
      price: product.price || "",
      size: product.size || "",
      weight: product.weight || "",
      calories: product.calories || "",
      discount: product.discount || "",

      isSpicy: product.isSpicy || false,
      isPopular: product.isPopular || false,
      isVegetarian: product.isVegetarian || false,

      rating: product.rating || "",

      ingredients: product.ingredients
        ? product.ingredients.join(", ")
        : "",

      productDescription:
        product.productDescription || "",

      categoryId: product.categoryId || "",
    });

    setIsModalOpen(true);
  };


  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setSelectedProduct(null);

    setFormData({
      ...emptyForm,
    });
  };
  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      productName: formData.productName,
      productImg: formData.productImg,

      price: Number(formData.price),
      size: Number(formData.size),
      weight: Number(formData.weight),
      calories: Number(formData.calories),
      discount: Number(formData.discount),

      isSpicy: formData.isSpicy,
      isPopular: formData.isPopular,
      isVegetarian: formData.isVegetarian,

      rating: Number(formData.rating),

      ingredients: formData.ingredients
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),

      productDescription:
        formData.productDescription,

      categoryId: formData.categoryId,
    };

    try {
      if (isEditing) {
        await putData(
          selectedProduct.id,
          productData
        );
      } else {
        await postData(productData);
      }

      handleCloseModal();

      refresh();
    } catch (error) {
      console.log("CRUD ERROR:", error);
    }
  };
   const handleDelete = async (id) => {
  setDeletingId(id);

  try {
    await deleteData(id);
    refresh();
  } catch (error) {
    console.log("DELETE ERROR:", error);
  } finally {
    setDeletingId(null);
  }
};

  if (loading) {
    return <p>Loading...</p>;
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return <p>Something went wrong...</p>;
  }

  // =========================
  // JSX
  // =========================

  return (
    <div className="p-5">

      <div className="flex items-center justify-between mb-6">

        <h1 className="font-bold text-[32px]">
          Products
        </h1>

        <button
          onClick={handleCreate}
          className="px-5 py-3 rounded-xl bg-blue-600 text-white font-bold text-[18px] hover:bg-blue-700"
        >
          + Add Product
        </button>

      </div>

      <div className="flex flex-col gap-3">

        {products.map((el) => {

          // Check whether THIS product is being deleted
          const isDeleting = deletingId === el.id;

          return (
            <div
              key={el.id}
              className="h-24 w-full border flex px-3 items-center border-gray-300 rounded-[15px] bg-white"
            >

              <div className="flex items-center gap-4 w-full">


                <div className="h-18 w-18 shrink-0">

                  <img
                    className="w-full h-full rounded-xl object-contain"
                    src={el.productImg}
                    alt={el.productName}
                  />

                </div>

                <div className="flex items-center justify-between w-full">

                  <div>

                    <h2 className="text-[23px] font-medium">
                      {el.productName}
                    </h2>

                    <p className="text-gray-500">
                      {el.productDescription}
                    </p>

                  </div>

      
                  <div className="flex items-center gap-5">

                    <p className="text-[20px] font-semibold">
                      ${el.price}
                    </p>

                    <div className="flex gap-3">

                      {/* EDIT */}

                      <button
                        onClick={() => handleEdit(el)}
                        disabled={deleteLoading}
                        className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold disabled:opacity-50"
                      >
                        Edit
                      </button>

                      {/* DELETE */}

                      <button
                        disabled={deleteLoading}
                        onClick={() => handleDelete(el.id)}
                        className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold disabled:opacity-50"
                      >
                        {isDeleting
                          ? "Deleting..."
                          : "Delete"}
                      </button>

                    </div>

                  </div>

                </div>

              </div>

            </div>
          );
        })}

      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5">

          <div className="w-full max-w-[600px] max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6">

            <div className="flex items-center justify-between mb-6">

              <h2 className="text-2xl font-bold">
                {isEditing
                  ? "Edit Product"
                  : "Add Product"}
              </h2>

              <button
                type="button"
                onClick={handleCloseModal}
                className="text-3xl text-gray-400 hover:text-black"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
            >

              <div>

                <label className="block mb-1 font-medium">
                  Product name
                </label>

                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  placeholder="Pepperoni Fresh"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  required
                />

              </div>

              {/* IMAGE */}

              <div>

                <label className="block mb-1 font-medium">
                  Product image
                </label>

                <input
                  type="text"
                  name="productImg"
                  value={formData.productImg}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  required
                />

              </div>

              {/* PRICE + SIZE */}

              <div className="grid grid-cols-2 gap-4">

                <div>

                  <label className="block mb-1 font-medium">
                    Price
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
                    required
                  />

                </div>

                <div>

                  <label className="block mb-1 font-medium">
                    Size
                  </label>

                  <input
                    type="number"
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
                  />

                </div>

              </div>

              {/* WEIGHT + CALORIES */}

              <div className="grid grid-cols-2 gap-4">

                <div>

                  <label className="block mb-1 font-medium">
                    Weight
                  </label>

                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
                  />

                </div>

                <div>

                  <label className="block mb-1 font-medium">
                    Calories
                  </label>

                  <input
                    type="number"
                    name="calories"
                    value={formData.calories}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
                  />

                </div>

              </div>

              {/* DISCOUNT + RATING */}

              <div className="grid grid-cols-2 gap-4">

                <div>

                  <label className="block mb-1 font-medium">
                    Discount
                  </label>

                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
                  />

                </div>

                <div>

                  <label className="block mb-1 font-medium">
                    Rating
                  </label>

                  <input
                    type="number"
                    step="0.1"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
                  />

                </div>

              </div>


              <div>

                <label className="block mb-1 font-medium">
                  Category ID
                </label>

                <input
                  type="text"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  placeholder="1"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
                  required
                />

              </div>

              <div>

                <label className="block mb-1 font-medium">
                  Ingredients
                </label>

                <input
                  type="text"
                  name="ingredients"
                  value={formData.ingredients}
                  onChange={handleChange}
                  placeholder="pepperoni, mozzarella, tomatoes"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
                />

                <p className="mt-1 text-sm text-gray-400">
                  Separate ingredients with commas
                </p>

              </div>


              <div>

                <label className="block mb-1 font-medium">
                  Description
                </label>

                <textarea
                  name="productDescription"
                  value={formData.productDescription}
                  onChange={handleChange}
                  placeholder="Spicy pepperoni, extra portion of mozzarella..."
                  rows={3}
                  className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none"
                />

              </div>

              <div className="grid grid-cols-3 gap-3">

                <label className="flex items-center gap-2">

                  <input
                    type="checkbox"
                    name="isSpicy"
                    checked={formData.isSpicy}
                    onChange={handleChange}
                  />

                  Spicy

                </label>

                <label className="flex items-center gap-2">

                  <input
                    type="checkbox"
                    name="isPopular"
                    checked={formData.isPopular}
                    onChange={handleChange}
                  />

                  Popular

                </label>

                <label className="flex items-center gap-2">

                  <input
                    type="checkbox"
                    name="isVegetarian"
                    checked={formData.isVegetarian}
                    onChange={handleChange}
                  />

                  Vegetarian

                </label>

              </div>


              <button
                type="submit"
                disabled={
                  postLoading ||
                  putLoading
                }
                className="mt-2 w-full rounded-xl bg-blue-600 py-3 text-lg font-bold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {postLoading || putLoading
                  ? "Saving..."
                  : isEditing
                    ? "Save Changes"
                    : "Create Product"}
              </button>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default Product;