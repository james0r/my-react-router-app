import { Link, type MetaFunction } from "react-router"
// import { supabase } from "~/supabase-client"
import { createClient } from '~/utils/supabase.server'
import type { Route } from "./+types/_index"

export async function loader({ request }: Route.LoaderArgs) {

  const { supabase } = createClient(request)

  const { data, error } = await supabase.from('items').select('*')

  if (error) {
    return { error: error.message }
  }

  return { items: data }
}

export const meta: MetaFunction = () => {
  return [
    { title: "Items - RRv7 CRUD" },
    { name: "description", content: "List of items in the RRv7 CRUD app" },
  ]
}

export default function Items({ loaderData }: Route.ComponentProps) {
  const { error, items } = loaderData

  return (
    <div>
      {' '}
      <h2>List of items</h2>

      {error && <p className="text-red-500">Error: {error}</p>}

      <ul>
        {items?.map((item) => (

          <li key={item.id} className="border-b border-gray-300 py-2 bg-white mb-4 shadow-md p-4 rounded">
            <Link to={`/items/${item.id}`}>
              <h3 className="font-bold">{item.title}</h3>
              <p>{item.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}