import { useNavigate, Link } from "react-router-dom"
import { toast } from "react-toastify"
import { useFormik } from "formik"
import * as Yup from "yup"

function Register() {
  const navigate = useNavigate()

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .required("Username is required"),

    email: Yup.string()
      .min(5, "Email must be at least 5 characters")
      .email("Email must contain a valid @ email address")
      .required("Email is required"),

    password: Yup.string()
      .required("Password is required"),
  })

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },

    validationSchema,

    onSubmit: (values) => {
      const name = values.name.trim()
      const email = values.email.trim().toLowerCase()
      const password = values.password

      const existingUsers = JSON.parse(
        localStorage.getItem("mock_users") || "[]"
      )

      if (
        existingUsers.some(
          (user) =>
            user.email === email ||
            user.name === name ||
            user.password === password
        )
      ) {
        toast.error(
          "A user with this email, password, or name already exists!"
        )
        return
      }

      const newUser = {
        name,
        email,
        password,
      }

      existingUsers.push(newUser)

      localStorage.setItem(
        "mock_users",
        JSON.stringify(existingUsers)
      )

      toast.success("Registration successful!")

      navigate("/login")
    },
  })

  return (
    <div className="w-full h-screen flex items-center justify-center bg-[gray]/50">
      <form
        onSubmit={formik.handleSubmit}
        className="max-w-70 p-5 w-full rounded-2xl mx-auto bg-[white]"
      >
        <h1 className="text-center text-xl font-bold mb-5">
          Registration
        </h1>

        {/* NAME */}
        <div className="mb-5">
          <label
            htmlFor="name"
            className="block mb-2.5 text-sm font-medium text-heading"
          >
            Your username
          </label>

          <input
            type="text"
            name="name"
            id="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-2xl block w-full px-3 py-2.5 shadow-xs"
            placeholder="Username"
          />

          {formik.touched.name && formik.errors.name && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.name}
            </p>
          )}
        </div>

        {/* EMAIL */}
        <div className="mb-5">
          <label
            htmlFor="email"
            className="block mb-2.5 text-sm font-medium text-heading"
          >
            Your email
          </label>

          <input
            type="email"
            name="email"
            id="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-2xl block w-full px-3 py-2.5 shadow-xs"
            placeholder="example@gmail.com"
          />

          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.email}
            </p>
          )}
        </div>

        {/* PASSWORD */}
        <div className="mb-5">
          <label
            htmlFor="password"
            className="block mb-2.5 text-sm font-medium text-heading"
          >
            Your password
          </label>

          <input
            type="password"
            name="password"
            id="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-2xl block w-full px-3 py-2.5 shadow-xs"
            placeholder="••••••••"
          />

          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="text-white bg-[black] box-border w-full border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-2xl text-sm px-4 py-2.5 focus:outline-none"
        >
          Submit
        </button>

        <div className="text-center text-sm mt-2">
          Already have account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:underline"
          >
            Enter
          </Link>
        </div>
      </form>
    </div>
  )
}

export default Register