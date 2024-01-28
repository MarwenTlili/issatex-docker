// https://github.com/api-platform/demo/blob/main/pwa/components/admin/Admin.tsx

import Head from 'next/head'
import { useContext, useState } from 'react'
import { Navigate, Route } from 'react-router-dom'
import {
    Layout,
    LayoutProps,
    localStorageStore,
    Login,
    LoginClasses,
    resolveBrowserLocale,
    Resource,
} from 'react-admin'
import polyglotI18nProvider from 'ra-i18n-polyglot'
import englishMessages from 'ra-language-english'
import frenchMessages from 'ra-language-french'
import {
    HydraAdmin,
    OpenApiAdmin,
    useIntrospection,
} from '@api-platform/admin'
import AppBar from './AppBar'
import { LoginForm } from './LoginForm'
import DocContext from './DocContext'
import authProvider from '../../utils/authProvider'

import ArticleList from './article/List'
import ArticleShow from './article/Show'

import EmployeeList from './employee/List'
import EmployeeCreate from './employee/Create'
import EmployeeShow from './employee/Show'
import EmployeeEdit from './employee/Edit'

import MachineList from './machine/List'
import MachineCreate from './machine/Create'
import MachineShow from './machine/Show'
import MachineEdit from './machine/Edit'

import OrderList from './manufacturingOrder/List'
import OrderShow from './manufacturingOrder/Show'

import ScheduleList from './weeklySchedule/List'
import ScheduleCreate from './weeklySchedule/Create'
import ScheduleShow from './weeklySchedule/Show'
import ScheduleEdit from './weeklySchedule/Edit'

import ClientList from './client/List'
import ClientCreate from './client/Create'
import ClientShow from './client/Show'
import ClientEdit from './client/Edit'

import UserList from './user/List';
import UserCreate from './user/Create'
import UserShow from './user/Show'
import UserEdit from './user/Edit'

import IlotList from './Ilot/List'
import IlotCreate from './Ilot/Create'
import IlotShow from './Ilot/Show'
import IlotEdit from './Ilot/Edit'

import {
    Assignment,
    Checkroom,
    Hardware,
    People,
    PeopleOutline,
    PersonSearch
} from '@mui/icons-material'
import AddHomeWorkIcon from '@mui/icons-material/AddHomeWork'
import ScheduleSendIcon from '@mui/icons-material/ScheduleSend'

import customDataProvider from '../../utils/customDataProvider'

const RedirectToLogin = () => {
    const introspect = useIntrospection()

    if (localStorage.getItem('token')) {
        introspect()
        return <></>
    }
    return <Navigate to='/login' />
}

const messages = {
    fr: frenchMessages,
    en: englishMessages,
}

const i18nProvider = polyglotI18nProvider(
    // @ts-ignore
    (locale) => (messages[locale] ? messages[locale] : messages.en),
    resolveBrowserLocale(),
)

const LoginPage = () => (
    <Login
        sx={{
            backgroundImage:
                'radial-gradient(circle at 50% 14em, #90dfe7 0%, #288690 60%, #288690 100%)',
            [`& .${LoginClasses.icon}`]: {
                backgroundColor: 'secondary.main',
            },
        }}
    >
        <LoginForm />
    </Login>
)

const MyLayout = (props: JSX.IntrinsicAttributes & LayoutProps) => <Layout {...props} appBar={AppBar} />

const AdminUI = () => {
    const { docType } = useContext(DocContext)
    const [redirectToLogin, setRedirectToLogin] = useState(false)

    return docType === 'hydra' ? (
        <HydraAdmin
            dataProvider={customDataProvider(setRedirectToLogin)}
            authProvider={authProvider}
            entrypoint={window.origin}
            i18nProvider={i18nProvider}
            layout={MyLayout}
            loginPage={LoginPage}
        >
            {redirectToLogin
                ? <Route path='/' element={<RedirectToLogin />} />
                : <>
                    <Resource
                        name='api/articles'
                        list={ArticleList}
                        show={ArticleShow}
                        icon={Checkroom}
                        recordRepresentation='designation'
                        options={{ label: 'Articles' }}
                    />
                    <Resource
                        name='api/employees'
                        list={EmployeeList}
                        show={EmployeeShow}
                        create={EmployeeCreate}
                        edit={EmployeeEdit}
                        icon={People}
                        recordRepresentation={(record) => `${record.firstName} ${record.lastName}`}
                        options={{ label: 'Employees' }}
                    />
                    <Resource
                        name='api/machines'
                        list={MachineList}
                        show={MachineShow}
                        create={MachineCreate}
                        edit={MachineEdit}
                        icon={Hardware}
                        recordRepresentation='name'
                        options={{ label: 'Machines' }}
                    />
                    <Resource
                        name='api/ilots'
                        list={IlotList}
                        show={IlotShow}
                        edit={IlotEdit}
                        create={IlotCreate}
                        icon={AddHomeWorkIcon}
                        recordRepresentation='name'
                        options={{ label: 'Ilot' }}
                    />
                    <Resource
                        name='api/manufacturing_orders'
                        list={OrderList}
                        show={OrderShow}
                        icon={Assignment}
                        options={{ label: 'Orders' }}
                    />
                    <Resource
                        name='api/weekly_schedules'
                        list={ScheduleList}
                        show={ScheduleShow}
                        create={ScheduleCreate}
                        edit={ScheduleEdit}
                        icon={ScheduleSendIcon}
                        options={{ label: 'Schedule' }}
                    />
                    <Resource
                        name='api/clients'
                        list={ClientList}
                        show={ClientShow}
                        create={ClientCreate}
                        edit={ClientEdit}
                        recordRepresentation='name'
                        options={{ label: 'Clients' }}
                        icon={PeopleOutline}
                    />
                    <Resource
                        name='api/users'
                        list={UserList}
                        show={UserShow}
                        create={UserCreate}
                        edit={UserEdit}
                        recordRepresentation='username'
                        options={{ label: 'Users' }}
                        icon={PersonSearch}
                    />
                </>
            }
        </HydraAdmin>
    ) : (
        <OpenApiAdmin
            authProvider={authProvider}
            entrypoint={window.origin}
            docEntrypoint={`${window.origin}/docs.json`}
            i18nProvider={i18nProvider}
            layout={MyLayout}
            loginPage={LoginPage}
        />
    )
}

const store = localStorageStore()

const AdminWithContext = () => {
    const [docType, setDocType] = useState(
        store.getItem<string>('docType', 'hydra'),
    )

    return (
        <DocContext.Provider
            value={{
                docType,
                setDocType,
            }}>
            <AdminUI />
        </DocContext.Provider>
    )
}

const AdminCustom = () => (
    <>
        <Head>
            <title>API Platform Admin</title>
        </Head>

        <AdminWithContext />
    </>
)

export default AdminCustom
