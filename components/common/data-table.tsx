"use client"

import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Column<T> {
  header: string
  accessor: keyof T | string
  render?: (value: any, row: T, index: number) => ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  title?: string
  onAddClick?: () => void
  loading?: boolean
  pagination?: {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
  }
}

export function DataTable<T extends { id?: string | number }>({
  columns,
  data,
  title,
  onAddClick,
  loading = false,
  pagination,
}: DataTableProps<T>) {
  // Fix: Ensure data is always an array
  const tableData = Array.isArray(data) ? data : []
  
  return (
    <Card>
      {title && (
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{title}</CardTitle>
          {onAddClick && (
            <Button onClick={onAddClick} size="sm">
              + Add New
            </Button>
          )}
        </CardHeader>
      )}
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {columns.map((column, index) => (
                  <th key={index} className="text-left py-3 px-4 font-semibold text-muted-foreground">
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-8">
                    Loading...
                  </td>
                </tr>
              ) : tableData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                    No data found
                  </td>
                </tr>
              ) : (
                tableData.map((row, rowIndex) => (
                  <tr key={row.id || rowIndex} className="border-b border-border hover:bg-secondary/50">
                    {columns.map((column, colIndex) => (
                      <td key={colIndex} className={`py-3 px-4 ${column.className || ""}`}>
                        {column.render
                          ? column.render(
                              typeof column.accessor === "string"
                                ? (row as any)[column.accessor]
                                : (row[column.accessor] as any),
                              row,
                              rowIndex,
                            )
                          : typeof column.accessor === "string"
                            ? (row as any)[column.accessor]
                            : (row[column.accessor] as any)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls - Always show if pagination prop exists */}
        {pagination && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              <span>Showing {tableData.length} items</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Page {pagination.currentPage} of {pagination.totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage >= pagination.totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}