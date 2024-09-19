import { useCallback, useState } from "react"
import { Employee } from "../utils/types"
import { useCustomFetch } from "./useCustomFetch"
import { EmployeeResult } from "./types"
import { useWrappedRequest } from "./useWrappedRequest"

export function useEmployees(): EmployeeResult {
  const { fetchWithCache } = useCustomFetch()
  const { loading}= useWrappedRequest()
  const [employees, setEmployees] = useState<Employee[] | null>(null)

  const fetchAll = useCallback(
    async () => {
        const employeesData = await fetchWithCache<Employee[]>("employees")
        setEmployees(employeesData)
      },
    [fetchWithCache]
  )

  const invalidateData = useCallback(() => {
    setEmployees(null)
  }, [])

  return { data: employees, loading, fetchAll, invalidateData }
}
