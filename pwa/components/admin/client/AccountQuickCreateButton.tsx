import React, { Dispatch, SetStateAction, useState } from 'react'
import {
    BooleanInput,
    Button,
    ImageField,
    ImageInput,
    PasswordInput,
    SimpleForm,
    TextInput,
    useCreate,
    useNotify
} from 'react-admin'
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { equalToPlainPassword } from '../user/Create'
import { User } from '../../../types/User'

interface AccountQuickCreateButtonProps {
    resource: string
    setCreatedUser: Dispatch<SetStateAction<User | undefined>>
}

const AccountQuickCreateButton = (props: AccountQuickCreateButtonProps) => {
    const { resource, setCreatedUser } = props
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const notify = useNotify()
    const [create, { isLoading, error }] = useCreate<User, Error>()

    const handleModalToggle = () => setIsOpen(!isOpen)
    const handleOnClose = () => setIsOpen(false)

    const handleSubmit = (values: User) => {
        const { confirmPassword, ...newUser } = values
        create(resource, { data: newUser }, {
            onSettled: (data, error) => {
                if (error) {
                    notify('Error Creating User', { type: 'error', messageArgs: { _: 'User Not Created Response' } })
                }
                if (data) {
                    notify('User Created', { type: 'success', messageArgs: { _: 'User Created' } })
                    setCreatedUser(data)
                    handleOnClose()
                }
            },
            onError: (error) => {
                console.log('error: ', error)
                notify('Error creating user', { type: 'error', messageArgs: { _: 'User Not Created' } })
            }
        })
    }

    return (
        <>
            <Button onClick={handleModalToggle} size='large' >
                <AddIcon />
            </Button>

            <Dialog fullWidth open={isOpen} onClose={handleOnClose} aria-label='Create User' >
                <DialogTitle>Create User</DialogTitle>
                <DialogContent>
                    <SimpleForm resource='account' onSubmit={handleSubmit} >
                        <ImageInput source='avatar' label='Avatar' accept='image/*' maxSize={1000000} >
                            <ImageField source='contentUrl' title='title' />
                        </ImageInput>
                        <TextInput source='email' required={true} />
                        <TextInput source='username' required={true} />
                        <PasswordInput source='plainPassword' required={true} />
                        <PasswordInput source='confirmPassword' validate={equalToPlainPassword} />
                        <BooleanInput source='isVerified' />
                    </SimpleForm>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default AccountQuickCreateButton
