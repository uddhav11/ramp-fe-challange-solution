// import { Fragment, useCallback, useEffect, useMemo, useState } from "react"
// import { InputSelect } from "./components/InputSelect"
// import { Instructions } from "./components/Instructions"
// import { Transactions } from "./components/Transactions"
// import { useEmployees } from "./hooks/useEmployees"
// import { usePaginatedTransactions } from "./hooks/usePaginatedTransactions"
// import { useTransactionsByEmployee } from "./hooks/useTransactionsByEmployee"
// import { EMPTY_EMPLOYEE } from "./utils/constants"
// import { Employee } from "./utils/types"
// import { TransactionPane } from "./components/Transactions/TransactionPane"

// export function App() {
//   const { data: employees, ...employeeUtils } = useEmployees()
//   const { data: paginatedTransactions, ...paginatedTransactionsUtils } = usePaginatedTransactions()
//   const { data: transactionsByEmployee, ...transactionsByEmployeeUtils } = useTransactionsByEmployee()
//   const [isLoading, setIsLoading] = useState(false)

//   const transactions = useMemo(
//     () => paginatedTransactions?.data ?? transactionsByEmployee ?? null,
//     [paginatedTransactions, transactionsByEmployee]
//   )

//   const loadAllTransactions = useCallback(async () => {
//     setIsLoading(true)
//     transactionsByEmployeeUtils.invalidateData()

//     await employeeUtils.fetchAll()
//         setIsLoading(false)

//     await paginatedTransactionsUtils.fetchAll()

//   }, [employeeUtils, paginatedTransactionsUtils, transactionsByEmployeeUtils])

//   const loadTransactionsByEmployee = useCallback(
//     async (employeeId: string) => {
//       paginatedTransactionsUtils.invalidateData()
//       await transactionsByEmployeeUtils.fetchById(employeeId)
//     },
//     [paginatedTransactionsUtils, transactionsByEmployeeUtils]
//   )

//   useEffect(() => {
//     if (employees === null && !employeeUtils.loading) {
//       loadAllTransactions()
//     }
//   }, [employeeUtils.loading, employees, loadAllTransactions])

//   return (
//     <Fragment>
//       <main className="MainContainer">
//         <Instructions />

//         <hr className="RampBreak--l" />

//         <InputSelect<Employee>
//           isLoading={isLoading}
//           defaultValue={EMPTY_EMPLOYEE}
//           items={employees === null ? [] : [EMPTY_EMPLOYEE, ...employees]}
//           label="Filter by employee"
//           loadingLabel="Loading employees"
//           parseItem={(item) => ({
//             value: item.id,
//             label: `${item.firstName} ${item.lastName}`,
//           })}
//           onChange={async (newValue) => {
//             // if (newValue === null) {
//             //   return
//             // }

//             // await loadTransactionsByEmployee(newValue.id)


//             // correction in code for bog 3
//             if (newValue === null) {
//               return
//             }
//             else if (newValue.id === "") {
//               await loadAllTransactions()
//             }
//             else await loadTransactionsByEmployee(newValue.id)


//           }}
//         />

//         <div className="RampBreak--l" />

//         <div className="RampGrid">
//           {/* {transactions === null ? (
//             <div className="RampLoading--container">Loading...</div>
//           ) : (
//             <Fragment>
//               <div data-testid="transaction-container">
//                 {transactions.map((transaction) => (
//                   <TransactionPane key={transaction.id} transaction={transaction} />
//                 ))}
//               </div>
//               <button
//                 className="RampButton"
//                 disabled={paginatedTransactionsUtils.loading || paginatedTransactions?.nextPage == null || transactionsByEmployee?.length === 0}
//                 onClick={async () => {
//                   await loadAllTransactions()
//                 }}
//               >
//                 View More
//               </button>
//             </Fragment>
//           )} */}
//           <Transactions transactions={transactions} />

// {transactions !== null  && (
//   <button
//     className="RampButton"
//     disabled={paginatedTransactionsUtils.loading}
//     onClick={async () => {
//       await loadAllTransactions()
//     }}
//   >
//     View More
//   </button>
// )}
//         </div>
//       </main>
//     </Fragment>
//   )
// }




import { Fragment, useCallback, useEffect, useMemo, useState } from "react"
import { InputSelect } from "./components/InputSelect"
import { Instructions } from "./components/Instructions"
import { Transactions } from "./components/Transactions"
import { useEmployees } from "./hooks/useEmployees"
import { usePaginatedTransactions } from "./hooks/usePaginatedTransactions"
import { useTransactionsByEmployee } from "./hooks/useTransactionsByEmployee"
import { EMPTY_EMPLOYEE } from "./utils/constants"
import { Employee } from "./utils/types"

export function App() {
  const { data: employees, ...employeeUtils } = useEmployees()
  const { data: paginatedTransactions, ...paginatedTransactionsUtils } = usePaginatedTransactions()
  const { data: transactionsByEmployee, ...transactionsByEmployeeUtils } = useTransactionsByEmployee()
  const [isLoading, setIsLoading] = useState(false)
  const [showViewMore, setShowViewMore] = useState(true)

  const transactions = useMemo(
    () => paginatedTransactions?.data ?? transactionsByEmployee ?? null,
    [paginatedTransactions, transactionsByEmployee]
  )

  const loadAllTransactions = useCallback(async () => {
    setIsLoading(true)
    transactionsByEmployeeUtils.invalidateData()

    await employeeUtils.fetchAll()
    setIsLoading(false) // Solution for Bug #5
    await paginatedTransactionsUtils.fetchAll()
  }, [employeeUtils, paginatedTransactionsUtils, transactionsByEmployeeUtils])

  const loadTransactionsByEmployee = useCallback(
    async (employeeId: string) => {
      paginatedTransactionsUtils.invalidateData()
      await transactionsByEmployeeUtils.fetchById(employeeId)
      setShowViewMore(false)
    },
    [paginatedTransactionsUtils, transactionsByEmployeeUtils]
  )

  useEffect(() => {
    if (paginatedTransactions?.nextPage === null && !!paginatedTransactions?.data) {
      setShowViewMore(false)
    }
  }, [paginatedTransactions])

  useEffect(() => {
    if (employees === null && !employeeUtils.loading) {
      loadAllTransactions()
    }
  }, [employeeUtils.loading, employees, loadAllTransactions])

  return (
    <Fragment>
      <main className="MainContainer">
        <Instructions />

        <hr className="RampBreak--l" />

        <InputSelect<Employee>
          isLoading={isLoading}
          defaultValue={EMPTY_EMPLOYEE}
          items={employees === null ? [] : [EMPTY_EMPLOYEE, ...employees]}
          label="Filter by employee"
          loadingLabel="Loading employees"
          parseItem={(item) => ({
            value: item.id,
            label: `${item.firstName} ${item.lastName}`,
          })}
          onChange={async (newValue) => {
            if (newValue === null) {
              return
            }

            //  correction in code for bog 3
            if (newValue === null) {
              return
            }
            else if (newValue.id === "") {
              await loadAllTransactions()
            }
            else await loadTransactionsByEmployee(newValue.id)

          }}
        />

        <div className="RampBreak--l" />

        <div className="RampGrid">
          <Transactions transactions={transactions} />

          {transactions !== null && showViewMore && (
            <button
              className="RampButton"
              disabled={paginatedTransactionsUtils.loading}
              onClick={async () => {
                await loadAllTransactions()
              }}
            >
              View More
            </button>
          )}
        </div>
      </main>
    </Fragment>
  )
}
