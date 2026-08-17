import { useNavigate, Link } from "react-router-dom"
import Cookies from "js-cookie"
import { useFormik } from "formik"
import * as Yup from "yup"
import { toast } from "react-toastify"

function Login({ setAuth }) {
  const navigate = useNavigate()

  const validationSchema = Yup.object({
    email: Yup.string()
      .min(5, "Email must be at least 5 characters")
      .email("Enter a valid email")
      .required("Email is required"),

    password: Yup.string()
      .required("Password is required"),
  })

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema,

    onSubmit: (values) => {
      const email = values.email.trim().toLowerCase()
      const password = values.password

      const existingUsers = JSON.parse(
        localStorage.getItem("mock_users") || "[]"
      )

      const isMockUser = existingUsers.some(
        (user) =>
          user.email === email &&
          user.password === password
      )

      if (isMockUser) {
        const mockToken = crypto.randomUUID()

        Cookies.set("token", mockToken, {
          expires: 1,
        })

        setAuth(true)

        toast.success("Login successful!")

        navigate("/")
      } else {
        toast.error("Wrong email or password")
      }
    },
  })

  return (
    <div className="w-full h-screen flex items-center justify-center bg-[gray]/50">
      <form
        onSubmit={formik.handleSubmit}
        className="max-w-70 p-5 w-full rounded-2xl mx-auto bg-[white]"
      >
        <h1 className="text-center text-xl font-bold mb-5">
          Login
        </h1>

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
            className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-2xl block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
            placeholder="name@flowbite.com"
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
            className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-2xl block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
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
          Do not have account?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:underline"
          >
            Create
          </Link>
        </div>
      </form>
    </div>
  )
}

export default Login