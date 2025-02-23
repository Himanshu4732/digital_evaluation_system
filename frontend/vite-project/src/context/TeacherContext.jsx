import React, { createContext, useState } from 'react'

export const TeacherDataContext = createContext()


const TeacherContext = ({ children }) => {

    const [ teacher, setTeacher ] = useState({
        email: '',
        name: '',
    })

    return (
        <div>
            <TeacherDataContext.Provider value={{ teacher, setTeacher }}>
                {children}
            </TeacherDataContext.Provider>
        </div>
    )
}

export default TeacherContext