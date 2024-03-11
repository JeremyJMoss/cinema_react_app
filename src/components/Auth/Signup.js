import Input from "../UI/Input"

const Signup = () => {
  return (
    <section className="flex flex-col items-center">
      <h1 className="text-xl font-semibold sm:text-3xl sm:font-medium">Welcome to Moss Cinema</h1>
      <p className="text-md sm:text-lg text-center text-balance py-4 md:max-w-lg">Create your profile below to enjoy access to a range of exclusive movie experiences</p>
      <Input
      />
    </section>
  )
}

export default Signup