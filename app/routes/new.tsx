import {
  Form,
  redirect,
  type ActionFunctionArgs,
  type MetaFunction
} from "react-router"
import { createClient } from "~/utils/supabase.server"
// import { supabase } from "~/supabase-client"

export const meta: MetaFunction = () => {
  return [
    { title: "New Item - RRv7 CRUD" },
    { name: "description", content: "Create a new item in the RRv7 CRUD app" },
  ]
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const title = formData.get('title')
  const description = formData.get('description')
  const { supabase } = createClient(request)


  if (!title || !description) {
    return { error: 'Title and Description are required' }
  }

  const { error } = await supabase.from('items').insert({
    title,
    description
  })

  if (error) {
    return { error: error.message }
  }

  return redirect('/')
}

export default function NewItem() {
  return (
    <div className="bg-white mx-auto w-full max-w-md p-8 rounded shadow-md">
      {' '}
      <h2 className="text-2xl font-bold">Create New Item</h2>
      <Form method="post">
        <div className="my-4">
          <label className="mb-1 block" htmlFor="">Title</label>
          <input className="p-2 block border border-gray-500 rounded-md h-10 w-full" type="text" name="title" required />
        </div>

        <div>
          <label className="mb-1 block" htmlFor="">Description</label>
          <textarea className="p-2 block border border-gray-500 rounded-md w-full" name="description" required />
        </div>
        <button className="cursor-pointer bg-green-500 text-white rounded-md py-2 px-4 mt-4" type="submit">Create Item</button>
      </Form>
    </div>
  )
}