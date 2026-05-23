import { Table } from "@node_modules/react-bootstrap/esm";
import SkeletonBox from "./Skeleton";

const TableSkeleton = () => {
  return (
    <div
      className="
        rounded-2xl overflow-hidden
        border border-gray-200 dark:border-gray-100/[0.08]
        bg-gray-100 dark:bg-[#0f172a]
        shadow-sm
      "
    >
      <Table
        striped
        bordered
        hover
        responsive="sm"
        className="
          mb-0 overflow-hidden
          text-sm md:text-base
          border-gray-200 dark:border-gray-100/[0.08]
        "
      >
        {/* Header */}
        <thead
          className="
            bg-gray-100 dark:bg-gray-100/[0.04]
            border-b border-gray-200 dark:border-gray-100/[0.08]
          "
        >
          <tr>
            {[...Array(7)].map((_, index) => (
              <th
                key={index}
                className="
                  p-3 text-center align-middle
                  bg-gray-100 dark:bg-gray-100/[0.04]
                  border-gray-200 dark:border-gray-100/[0.08]
                "
              >
                <SkeletonBox width="100%" height={18} />
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody
          className="
            bg-gray-100 dark:bg-[#0f172a]
            divide-y divide-gray-200 dark:divide-gray-100/[0.06]
          "
        >
          {[...Array(10)].map((_, rowIndex) => (
            <tr
              key={rowIndex}
              className="
                transition-colors duration-200
                hover:bg-gray-50 dark:hover:bg-gray-100/[0.03]
              "
            >
              {[...Array(7)].map((_, colIndex) => (
                <td
                  key={colIndex}
                  className="
                    px-4 py-3 text-center align-middle
                    border-gray-200 dark:border-gray-100/[0.06]
                    bg-gray-100 dark:bg-[#0f172a]
                  "
                >
                  <SkeletonBox width="100%" height={16} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TableSkeleton;