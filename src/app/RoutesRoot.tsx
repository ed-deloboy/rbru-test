import { FC, JSX } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { LandingLayout } from '../components/layouts/LandingLayout'
import { HomePage } from '../pages/home-page/HomePage'
import { CalculationsPage } from '../pages/calculations/CalculationsPage'

export const RoutesRoot: FC = (): JSX.Element => {
    return (
        <Routes>
            <Route path='/' element={<LandingLayout />}>
                <Route key="index" index element={<HomePage />} />
                <Route key='calculations' path='calculations' element={<CalculationsPage />} />
                <Route key="notfound" path="*" element={<Navigate to='/' />} />
            </Route>
        </Routes>
    )
}
