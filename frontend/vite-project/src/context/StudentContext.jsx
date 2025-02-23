import React, { createContext, useState } from 'react'

export const StudentDataContext = createContext()


const StudentContext = ({ children }) => {

    const [ student, setStudent ] = useState({
        email: '',
        name: '',
    })

    return (
        <div>
            <StudentDataContext.Provider value={{ student, setStudent }}>
                {children}
            </StudentDataContext.Provider>
        </div>
    )
}

export default StudentContext