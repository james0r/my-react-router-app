// import { supabase } from "~/supabase-client"
import type { Route } from "./+types/items.$id"
import { Form, redirect, type ActionFunctionArgs, type MetaFunction } from "react-router"
import { createClient } from '~/utils/supabase.server'

export const meta: MetaFunction = () => {
  return [
    { title: "Item Details - RRv7 CRUD" },
    { name: "description", content: "View and edit item details in the RRv7 CRUD app" },
  ]
}

export async function loader({ request, params }: Route.LoaderArgs) {

  const { supabase } = createClient(request)

  const { id } = params

  if (!id) {
    return { error: 'Item ID is required' }
  }

  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('id', id)
    .single()

  return { item: data }
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData()
  const title = formData.get('title')
  const description = formData.get('description')
  const intent = formData.get('intent')
  const { id } = params
  const { supabase } = createClient(request)


  if (!title || !description) {
    return { error: 'Title and Description are required' }
  }

  if (intent === 'delete') {
    const { error } = await supabase.from('items').delete().eq('id', id)

    if (error) {
      return { error: error.message }
    }

    return redirect('/')
  } else if (intent === 'update') {
    const { error } = await supabase.from('items').update({
      title,
      description
    }).eq('id', id)

    if (error) {
      return { error: error.message }
    }

    return { updated: true }
  }


  return redirect('/')
}

export default function Item({ loaderData, actionData }: Route.ComponentProps) {
  const { item, error } = loaderData

  if (error) {
    return <p className="text-red-500">Error: {error}</p>
  }

  return (
    <div>
      <h2>Item Details</h2>
      {
        actionData?.updated && <p className="bg-green-700 text-white p-2 rounded-md">Item updated successfully!</p>
      }
      <Form method="post">
        <div className="my-4">
          <label className="mb-1 block" htmlFor="">Title</label>
          <input defaultValue={item.title} className="p-2 block border border-gray-500 rounded-md h-10 w-full" type="text" name="title" required />
        </div>

        <div>
          <label className="mb-1 block" htmlFor="">Description</label>
          <textarea defaultValue={item.description} className="p-2 block border border-gray-500 rounded-md w-full" name="description" required />
        </div>
        <button name="intent" value="update" className="cursor-pointer bg-blue-600 text-white rounded-md py-2 px-4 mt-4" type="submit">
          Update Item
        </button>
        <button name="intent" value="delete" className="ml-4 cursor-pointer bg-red-500 text-white rounded-md py-2 px-4 mt-4" type="submit">
          Delete Item
        </button>
      </Form>
    </div>
  )
}