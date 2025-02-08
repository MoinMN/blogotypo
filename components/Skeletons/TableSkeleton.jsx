import { Table } from "@node_modules/react-bootstrap/esm"
import SkeletonBox from "./Skeleton"


const TableSkeleton = () => {
  return (
    <Table
      striped
      bordered
      hover
      responsive="sm"
      className="rounded-xl shadow-md overflow-hidden text-sm md:text-base"
    >
      <thead className="bg-gray-200">
        <tr>
          {[...Array(7)].map((_, index) => (
            <th key={index} className="p-2 text-center align-middle">
              <SkeletonBox />
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {[...Array(10)].map((_, index) => (
          <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">

            {[...Array(7)].map((_, index) => (
              <td key={index} className="px-4 py-3 text-center align-middle">
                <SkeletonBox />
              </td>
            ))}

          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default TableSkeleton
