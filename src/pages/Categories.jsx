import { useState } from "react";
import useDelete from "../hooks/useDelete";
import useGet from "../hooks/useGet";
import usePost from "../hooks/usePost";
import usePut from "../hooks/usePut";

const emptyForm = {
  categoryName: "",
  categoryImg: "",
};

function Categories() {
  const {
    data: categories,
    loading,
    error,
    refresh,
  } = useGet("/categories");

  const {
    deleteData,
    loading: deleteLoading,
  } = useDelete("/categories");

  const {
    postData,
    loading: postLoading,
  } = usePost("/categories");

  const {
    putData,
    loading: putLoading,
  } = usePut("/categories");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [formData, setFormData] = useState(emptyForm);

  // =========================
  // CREATE
  // =========================

  const handleCreate = () => {
    setIsEditing(false);
    setSelectedCategory(null);

    setFormData({
      ...emptyForm,
    });

    setIsModalOpen(true);
  };

  // =========================
  // EDIT
  // =========================

  const handleEdit = (category) => {
    setIsEditing(true);
    setSelectedCategory(category);

    setFormData({
      categoryName: category.categoryName || "",
      categoryImg: category.categoryImg || "",
    });

    setIsModalOpen(true);
  };

  // =========================
  // CLOSE MODAL
  // =========================

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setSelectedCategory(null);

    setFormData({
      ...emptyForm,
    });
  };

  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        await putData(selectedCategory.id, formData);
      } else {
        await postData(formData);
      }

      handleCloseModal();
      refresh();
    } catch (error) {
      console.log("Category CRUD error:", error);
    }
  };



  const handleDelete = async (id) => {
    console.log("Trying to delete category:", id);

    try {
      await deleteData(id);

      console.log("Category deleted");

      refresh();
    } catch (error) {
      console.log("DELETE CATEGORY ERROR:", error);
      console.log("Status:", error.response?.status);
      console.log("Response:", error.response?.data);
    }
  };


  if (loading) {
    return <p>Loading...</p>;
  }


  if (error) {
    return <p>Something went wrong...</p>;
  }

  return (
    <div className="pl-5 pt-4 pr-5">


      <div className="flex items-center justify-between mb-6">

        <h1 className="font-bold text-[32px]">
          Categories
        </h1>

        <button
          onClick={handleCreate}
          className="px-5 py-3 rounded-xl bg-blue-600 text-white font-bold text-[18px] hover:bg-blue-700 transition"
        >
          + Add Category
        </button>

      </div>



      <div className="flex flex-col gap-3">

        {categories.map((category) => (
          <div
            key={category.id}
            className="h-24 w-full border flex px-3 items-center border-gray-300 rounded-[15px] bg-white"
          >


            <div className="h-18 w-18 shrink-0 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden">

              <img
                src={category.categoryImg}
                alt={category.categoryName}
                className="w-14 h-14 object-contain"
              />

            </div>

            <div className="flex items-center justify-between w-full ml-4">

              <div>
                <h2 className="text-[23px] font-medium">
                  {category.categoryName}
                </h2>

                <p className="text-gray-400">
                  Category
                </p>
              </div>


              <div className="flex gap-3">

                <button
                  onClick={() => handleEdit(category)}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold"
                >
                  Edit
                </button>

                <button
                  disabled={deleteLoading}
                  onClick={() => handleDelete(category.id)}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold disabled:opacity-50"
                >
                  {deleteLoading ? "Deleting..." : "Delete"}
                </button>

              </div>

            </div>

          </div>
        ))}

      </div>


      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5">

          <div className="w-full max-w-[500px] rounded-2xl bg-white p-6">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between mb-6">

              <h2 className="text-2xl font-bold">
                {isEditing ? "Edit Category" : "Add Category"}
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
                  Category name
                </label>

                <input
                  type="text"
                  name="categoryName"
                  value={formData.categoryName}
                  onChange={handleChange}
                  placeholder="Pizza"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  required
                />

              </div>


              <div>

                <label className="block mb-1 font-medium">
                  Category image
                </label>

                <input
                  type="text"
                  name="categoryImg"
                  value={formData.categoryImg}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  required
                />

              </div>

              {/* IMAGE PREVIEW */}

              {formData.categoryImg && (
                <div className="flex justify-center">

                  <div className="w-24 h-24 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden">

                    <img
                      src={formData.categoryImg}
                      alt="Preview"
                      className="w-16 h-16 object-contain"
                    />

                  </div>

                </div>
              )}


              <button
                type="submit"
                disabled={postLoading || putLoading}
                className="mt-2 w-full rounded-xl bg-blue-600 py-3 text-lg font-bold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {postLoading || putLoading
                  ? "Saving..."
                  : isEditing
                    ? "Save Changes"
                    : "Create Category"}
              </button>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default Categories;